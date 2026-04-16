import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import renderMarkdown from "./renderMarkdown";

const md = `
# Hello

World

- One
  - Two
- Three

A [link](http://www.interactivethings.com/) and some **bold** and *italic* text. Blank links foo@bar.com https://foobar.com

~~~
a code block
~~~

Inline \`code\`

> Block quotes rock _another em style_
`;

test("Renders some Markdown", () => {
  expect(
    renderMarkdown({
      text: md
    })
  ).toMatchSnapshot();
});

test("Renders some Markdown with custom renderers", () => {
  expect(
    renderMarkdown({
      text: md,
      renderer: {
        paragraph() {
          return "HELLO PARAGRAPH";
        },
        listitem() {
          return "HELLO LIST ITEM";
        }
      }
    })
  ).toMatchSnapshot();
});

test("Sanitizes raw HTML from Markdown by default", () => {
  const nodes = renderMarkdown({
    text: '<p>Safe</p><img src="x" onerror="alert(1)">'
  });
  const html = renderToStaticMarkup(
    React.createElement(React.Fragment, null, ...nodes)
  );
  expect(html).not.toMatch(/onerror/i);
  expect(html).toContain("Safe");
});

test("Allows opting out of HTML sanitization", () => {
  const nodes = renderMarkdown({
    text: '<p data-test="x" onclick="void(0)">Hi</p>',
    sanitize: false
  });
  const html = renderToStaticMarkup(
    React.createElement(React.Fragment, null, ...nodes)
  );
  expect(html).toMatch(/onclick/i);
});

test("Inline code decodes HTML entities from marked codespan tokens", () => {
  let codeKey = 0;
  const nodes = renderMarkdown({
    text: "Example: `<div id=\"catalog\"></div>` and `a & b`.",
    renderer: {
      paragraph(content) {
        return React.createElement("p", null, content);
      },
      codespan(text) {
        codeKey += 1;
        return React.createElement("code", { key: `c${codeKey}` }, text);
      }
    }
  });
  const html = renderToStaticMarkup(
    React.createElement(React.Fragment, null, ...nodes)
  );
  // Marked stores codespan text HTML-escaped; we decode once so React does not
  // double-escape (which would show literal &lt;… in the UI as &amp;lt;… in HTML).
  expect(html).not.toMatch(/&amp;lt;/);
  expect(html).toMatch(/<code>&lt;div id=&quot;catalog&quot;&gt;&lt;\/div&gt;<\/code>/);
  expect(html).toMatch(/<code>a &amp; b<\/code>/);
});
