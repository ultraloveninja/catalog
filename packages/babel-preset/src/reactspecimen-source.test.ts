import { transform } from "@babel/core";
import plugin from "./reactspecimen-source";

const input = `<ReactSpecimen>
  <div>
    foo
  </div>
</ReactSpecimen>`;

const output = `"use strict";

/*#__PURE__*/React.createElement(ReactSpecimen, {
  sourceText: "<div>\\n  foo\\n</div>"
}, /*#__PURE__*/React.createElement("div", null, "foo"));`;

test("Adds sourceText prop", () => {
  expect(
    transform(input, {
      plugins: ["@babel/plugin-syntax-jsx", plugin],
      filename: "test.js"
    }).code
  ).toBe(output);
});
