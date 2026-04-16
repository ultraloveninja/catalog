import type { Compiler } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";

/**
 * Substitutes `%KEY%` placeholders in the emitted HTML (same idea as CRA’s plugin).
 * Keys should be simple alphanumerics (e.g. `PUBLIC_URL`, `NODE_ENV`).
 */
export default class InterpolateHtmlPlugin {
  private readonly htmlWebpackPlugin: typeof HtmlWebpackPlugin;
  private readonly replacements: Record<string, string | undefined>;

  constructor(
    htmlWebpackPlugin: typeof HtmlWebpackPlugin,
    replacements: Record<string, string | undefined>
  ) {
    this.htmlWebpackPlugin = htmlWebpackPlugin;
    this.replacements = replacements;
  }

  apply(compiler: Compiler): void {
    compiler.hooks.compilation.tap("InterpolateHtmlPlugin", compilation => {
      this.htmlWebpackPlugin
        .getHooks(compilation)
        .beforeEmit.tap("InterpolateHtmlPlugin", (data: { html: string }) => {
          Object.keys(this.replacements).forEach(key => {
            const value = this.replacements[key];
            if (value === undefined) {
              return;
            }
            const pattern = new RegExp(`%${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}%`, "g");
            data.html = data.html.replace(pattern, String(value));
          });
        });
    });
  }
}
