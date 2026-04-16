import marked from "./markdownReact";
import ReactRenderer from "./ReactRenderer";

/**
 * Default Lexer / pipeline options for marked v11+.
 * Only keys understood by `marked` are forwarded; `sanitize` is handled in `markdownReact.js`.
 */
const MARKDOWN_CONFIG = {
  gfm: true,
  breaks: true,
  sanitize: true
};

/**
 * @param {object} opts
 * @param {string} opts.text
 * @param {object} [opts.renderer] — Partial overrides merged onto {@link ReactRenderer}
 * @param {boolean} [opts.sanitize] — When true, raw HTML from Markdown is passed through `sanitize-html`
 * @param {boolean} [opts.gfm]
 * @param {boolean} [opts.breaks]
 */
export default ({ text, renderer, ...markdownOptions }) => {
  return marked(text, {
    ...MARKDOWN_CONFIG,
    ...markdownOptions,
    renderer: Object.assign(new ReactRenderer(), renderer)
  });
};
