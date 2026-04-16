import { cpSync, mkdirSync } from "fs";
import chalk from "chalk";
import { exists } from "sander";
import { resolveAppPath, resolveOwnPath } from "../utils/paths";

export interface InitCatalogOptions {
  force: boolean;
}

/**
 * Copy the bundled `setup-template` into the project (default `./catalog/`).
 */
export default async function initCatalog(
  catalogRelDir: string,
  { force }: InitCatalogOptions
): Promise<void> {
  const dest = resolveAppPath(catalogRelDir);
  const template = resolveOwnPath("..", "setup-template");
  const indexHtml = resolveAppPath(catalogRelDir, "index.html");

  if (!(await exists(template))) {
    console.error(
      chalk.red(
        "Could not find the setup-template directory next to @catalog/cli (your install may be broken)."
      )
    );
    process.exit(1);
  }

  if ((await exists(indexHtml)) && !force) {
    console.error(
      chalk.red(
        `'${catalogRelDir}' already contains index.html. Use --force to overwrite with the default template.`
      )
    );
    process.exit(1);
  }

  mkdirSync(dest, { recursive: true });
  cpSync(template, dest, { recursive: true });

  console.log(chalk.green(`Initialized Catalog in ./${catalogRelDir}/`));
  console.log(
    chalk.dim(
      `  Next: yarn catalog:start ${catalogRelDir}   (or: node packages/cli/dist/bin/catalog-start.js ${catalogRelDir})`
    )
  );
  console.log(
    chalk.dim(
      `  Add react, react-dom, and sass to your app. Imports from "catalog" are resolved from the CLI's bundled library — you do not need the npm package named catalog.`
    )
  );
}
