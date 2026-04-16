/**
 * WARNING: Don't use rollup's ES import/export here because otherwise file paths won't resolve correctly
 */
const { babel } = require("@rollup/plugin-babel");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const path = require("path");

const extensions = [".js", ".jsx", ".ts", ".tsx"];

module.exports = {
  input: path.resolve(__dirname, "src/index.ts"),
  external: ["@catalog/core"],
  plugins: [
    nodeResolve({
      extensions
    }),
    babel({
      babelHelpers: "bundled",
      extensions
    })
  ],
  output: [
    {
      dir: path.resolve(__dirname, "dist/"),
      entryFileNames: "[name].js",
      format: "cjs",
      sourcemap: true
    },
    {
      dir: path.resolve(__dirname, "dist/"),
      entryFileNames: "[name].es.js",
      format: "es",
      sourcemap: true
    }
  ]
};
