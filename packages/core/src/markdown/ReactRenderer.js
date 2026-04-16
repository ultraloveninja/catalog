import React from "react";
import Slugger from "github-slugger";
import Heading from "../components/Content/Heading";
import {
  Paragraph,
  UnorderedList,
  OrderedList,
  ListItem,
  BlockQuote,
  Hr,
  Em,
  Strong,
  CodeSpan,
  Del,
  Image,
  Link
} from "../components/Content/Markdown";

export default class ReactRenderer {
  constructor() {
    this.slugger = new Slugger();
    this.itemsRenderedCount = 0;
  }
  getKey() {
    return this.itemsRenderedCount++;
  }
  text(t) {
    return t;
  }
  checkbox(checked) {
    return (
      <input
        key={this.getKey()}
        type="checkbox"
        checked={!!checked}
        readOnly
        disabled
        aria-disabled="true"
      />
    );
  }
  code(code, lang /* , escaped*/) {
    const cls = lang && String(lang).trim() ? lang : undefined;
    return (
      <pre key={this.getKey()}>
        <code className={cls}>{code}</code>
      </pre>
    );
  }
  blockquote(quote) {
    return <BlockQuote key={this.getKey()}>{quote}</BlockQuote>;
  }
  heading(text, level, raw) {
    const slug = this.slugger.slug(raw);
    return <Heading key={this.getKey()} text={text} level={level} slug={slug} />;
  }
  hr() {
    return <Hr key={this.getKey()} />;
  }
  br() {
    return <br key={this.getKey()} />;
  }
  list(body, ordered) {
    const key = this.getKey();
    return ordered ? (
      <OrderedList key={key}>{body}</OrderedList>
    ) : (
      <UnorderedList key={key}>{body}</UnorderedList>
    );
  }
  listitem(text /* , task, checked */) {
    return <ListItem key={this.getKey()}>{text}</ListItem>;
  }
  paragraph(text) {
    return <Paragraph key={this.getKey()}>{text}</Paragraph>;
  }
  table(header, body) {
    return (
      <table key={this.getKey()}>
        <thead>{header}</thead>
        <tbody>{body}</tbody>
      </table>
    );
  }
  tablerow(content) {
    return <tr key={this.getKey()}>{content}</tr>;
  }
  tablecell(content) {
    return <td key={this.getKey()}>{content}</td>;
  }
  strong(content) {
    return <Strong key={this.getKey()}>{content}</Strong>;
  }
  em(content) {
    return <Em key={this.getKey()}>{content}</Em>;
  }
  codespan(content) {
    return <CodeSpan key={this.getKey()}>{content}</CodeSpan>;
  }
  del(content) {
    return <Del key={this.getKey()}>{content}</Del>;
  }
  link(href, title, text) {
    return (
      <Link to={href} title={title} key={this.getKey()}>
        {text}
      </Link>
    );
  }
  image(href, title, alt) {
    return <Image src={href} title={title} alt={alt} key={this.getKey()} />;
  }
  html(htmlInput /* , block */) {
    const raw = Array.isArray(htmlInput)
      ? htmlInput.join("")
      : String(htmlInput ?? "");
    return (
      <div
         
        dangerouslySetInnerHTML={{ __html: raw }}
        key={this.getKey()}
      />
    );
  }
}
