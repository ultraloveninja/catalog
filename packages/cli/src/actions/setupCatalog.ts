import { exists } from "sander";
import chalk from "chalk";
import { CatalogCLIPaths } from "./loadPaths";

export default async (paths: CatalogCLIPaths) => {
  const [
    indexJsExists,
    indexTsExists,
    indexTsxExists,
    htmlExists,
    dirExists
  ] = await Promise.all([
    exists(paths.catalogIndexJs + ".js"),
    exists(paths.catalogIndexJs + ".ts"),
    exists(paths.catalogIndexJs + ".tsx"),
    exists(paths.catalogIndexHtml),
    exists(paths.catalogSrcDir)
  ]);

  const indexExists = indexJsExists || indexTsExists || indexTsxExists;

  if (!dirExists) {
    // Use chalk.red(string) — chalk tagged templates treat `{…}` as style
    // delimiters, so messages like `index.{js,ts,tsx}` would throw at runtime.
    console.error(
      chalk.red(
        `The '${paths.unresolvedCatalogSrcDir}' directory doesn't exist. Please create it first.`
      )
    );
    process.exit(1);
  } else if (!indexExists || !htmlExists) {
    console.error(
      chalk.red(
        `Can't find index.js, index.ts, or index.tsx and index.html in '${paths.unresolvedCatalogSrcDir}'. Please make sure they exist.`
      )
    );
    process.exit(1);
  }
};
