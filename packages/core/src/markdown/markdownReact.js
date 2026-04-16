/**
 * Markdown → React using marked v11+ Lexer + a React-oriented compiler
 * (replaces the old marked 0.4 Parser / InlineLexer subclass approach).
 */
import { Lexer, Parser, TextRenderer, getDefaults } from "marked";
import sanitizeHtml from "sanitize-html";

const unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi;

function unescape(html) {
  return html.replace(unescapeTest, (_, n) => {
    const lower = n.toLowerCase();
    if (lower === "colon") {
      return ":";
    }
    if (lower.charAt(0) === "#") {
      return lower.charAt(1) === "x"
        ? String.fromCharCode(parseInt(lower.substring(2), 16))
        : String.fromCharCode(+lower.substring(1));
    }
    return "";
  });
}

/**
 * Marked’s lexer stores inline code as HTML-escaped text so the raw token is
 * safe in HTML contexts. We render codespan as React text, so decode entities
 * for display (e.g. `&lt;div&gt;` → `<div>`).
 */
const basicEntityRe = /&(?:#(?:x[0-9A-Fa-f]+|\d+)|[A-Za-z]+);/g;

function decodeMarkedCodespan(text) {
  if (text == null || text.indexOf("&") === -1) {
    return text;
  }
  return String(text).replace(basicEntityRe, match => {
    if (match.startsWith("&#x") || match.startsWith("&#X")) {
      const cp = parseInt(match.slice(3, -1), 16);
      return Number.isFinite(cp) ? String.fromCodePoint(cp) : match;
    }
    if (match.startsWith("&#")) {
      const cp = parseInt(match.slice(2, -1), 10);
      return Number.isFinite(cp) ? String.fromCodePoint(cp) : match;
    }
    const named = match.slice(1, -1).toLowerCase();
    switch (named) {
      case "lt":
        return "<";
      case "gt":
        return ">";
      case "amp":
        return "&";
      case "quot":
        return '"';
      case "apos":
        return "'";
      case "nbsp":
        return "\u00a0";
      default:
        return match;
    }
  });
}

function cleanUrl(href) {
  try {
    return encodeURI(href).replace(/%25/g, "%");
  } catch {
    return null;
  }
}

function sanitizeRawHtml(html, options) {
  if (!options.sanitize || html == null) {
    return html;
  }
  return sanitizeHtml(String(html));
}

class ReactMarkdownCompiler {
  constructor(options) {
    this.options = options;
    this.renderer = options.renderer;
  }

  slugSource(tokens) {
    const plain = Parser.parseInline(tokens, {
      ...this.options,
      renderer: new TextRenderer()
    });
    return unescape(plain);
  }

  parseInline(tokens, renderer = this.renderer) {
    if (!tokens || tokens.length === 0) {
      return [];
    }
    const parts = [];
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      switch (token.type) {
        case "escape": {
          parts.push(renderer.text(token.text));
          break;
        }
        case "html": {
          parts.push(
            renderer.html(sanitizeRawHtml(token.text, this.options), false)
          );
          break;
        }
        case "link": {
          const hrefClean = cleanUrl(token.href);
          const inner = this.parseInline(token.tokens, renderer);
          if (hrefClean === null) {
            parts.push(...inner);
          } else {
            parts.push(renderer.link(hrefClean, token.title, inner));
          }
          break;
        }
        case "image": {
          const hrefClean = cleanUrl(token.href);
          if (hrefClean === null) {
            parts.push(renderer.text(token.text));
          } else {
            parts.push(renderer.image(hrefClean, token.title, token.text));
          }
          break;
        }
        case "strong": {
          parts.push(renderer.strong(this.parseInline(token.tokens, renderer)));
          break;
        }
        case "em": {
          parts.push(renderer.em(this.parseInline(token.tokens, renderer)));
          break;
        }
        case "codespan": {
          parts.push(renderer.codespan(decodeMarkedCodespan(token.text)));
          break;
        }
        case "br": {
          parts.push(renderer.br());
          break;
        }
        case "del": {
          parts.push(renderer.del(this.parseInline(token.tokens, renderer)));
          break;
        }
        case "text": {
          parts.push(renderer.text(token.text));
          break;
        }
        default: {
          const msg = `Unknown inline token "${token.type}"`;
          if (this.options.silent) {
            console.error(msg);
          } else {
            throw new Error(msg);
          }
        }
      }
    }
    return parts.flat();
  }

  /**
   * @param {boolean} looseOrTop - At document root this is `true` (wrap loose text in paragraphs).
   *   Inside a list item, marked passes `list.loose` for the same slot.
   */
  parse(tokens, looseOrTop = true) {
    const out = [];
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      switch (token.type) {
        case "space": {
          break;
        }
        case "hr": {
          out.push(this.renderer.hr());
          break;
        }
        case "heading": {
          const text = this.parseInline(token.tokens);
          const raw = this.slugSource(token.tokens);
          out.push(this.renderer.heading(text, token.depth, raw));
          break;
        }
        case "code": {
          out.push(
            this.renderer.code(token.text, token.lang, !!token.escaped)
          );
          break;
        }
        case "table": {
          const headerCells = [];
          for (let j = 0; j < token.header.length; j++) {
            headerCells.push(
              this.renderer.tablecell(this.parseInline(token.header[j].tokens), {
                header: true,
                align: token.align[j]
              })
            );
          }
          const headerRow = this.renderer.tablerow(headerCells);
          const bodyRows = [];
          for (let j = 0; j < token.rows.length; j++) {
            const row = token.rows[j];
            const cells = [];
            for (let k = 0; k < row.length; k++) {
              cells.push(
                this.renderer.tablecell(this.parseInline(row[k].tokens), {
                  header: false,
                  align: token.align[k]
                })
              );
            }
            bodyRows.push(this.renderer.tablerow(cells));
          }
          out.push(this.renderer.table(headerRow, bodyRows));
          break;
        }
        case "blockquote": {
          const inner = this.parse(token.tokens, true);
          out.push(this.renderer.blockquote(inner));
          break;
        }
        case "list": {
          const loose = token.loose;
          const items = [];
          for (let j = 0; j < token.items.length; j++) {
            const item = token.items[j];
            const itemParts = [];
            if (item.task) {
              itemParts.push(this.renderer.checkbox(!!item.checked));
            }
            itemParts.push(...this.parse(item.tokens, loose));
            items.push(this.renderer.listitem(itemParts, item.task, !!item.checked));
          }
          out.push(this.renderer.list(items, token.ordered, token.start));
          break;
        }
        case "html": {
          out.push(
            this.renderer.html(
              sanitizeRawHtml(token.text, this.options),
              token.block
            )
          );
          break;
        }
        case "paragraph": {
          out.push(this.renderer.paragraph(this.parseInline(token.tokens)));
          break;
        }
        case "text": {
          let textToken = token;
          let body = textToken.tokens
            ? this.parseInline(textToken.tokens)
            : [textToken.text];
          while (
            i + 1 < tokens.length &&
            tokens[i + 1].type === "text"
          ) {
            i += 1;
            textToken = tokens[i];
            body = body.concat(
              "\n",
              textToken.tokens
                ? this.parseInline(textToken.tokens)
                : [textToken.text]
            );
          }
          if (looseOrTop) {
            out.push(this.renderer.paragraph(body));
          } else {
            out.push(...body);
          }
          break;
        }
        default: {
          const msg = `Unknown block token "${token.type}"`;
          if (this.options.silent) {
            console.error(msg);
          } else {
            throw new Error(msg);
          }
        }
      }
    }
    return out.flat();
  }
}

export default function markdownReact(src, opt) {
  const options = { ...getDefaults(), ...opt };
  // `sanitize` is a Catalog extension; marked’s lexer ignores unknown keys but we omit it explicitly.
  const lexerOptions = { ...options };
  delete lexerOptions.sanitize;
  const tokens = Lexer.lex(src, lexerOptions);
  const compiler = new ReactMarkdownCompiler(options);
  return compiler.parse(tokens, true).filter(x => x !== "" && x != null);
}
