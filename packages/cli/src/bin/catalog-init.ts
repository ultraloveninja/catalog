import args from "args";
import { errorMessage } from "../utils/format";
import initCatalog from "../actions/initCatalog";

args
  .option(
    ["f", "force"],
    "Overwrite when index.html already exists in the target directory",
    false
  );

const cliOptions = args.parse(process.argv, {
  value: "[catalog directory]",
  mri: {
    boolean: ["force"]
  }
});

const catalogDir = args.sub[0] || "catalog";
const force = Boolean(cliOptions.force);

initCatalog(catalogDir, { force }).catch(err => {
  console.error(
    errorMessage(
      "Could not initialize Catalog\n\n" + String(err?.stack || err)
    )
  );
  process.exit(1);
});
