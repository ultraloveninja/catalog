import { spawnSync } from "child_process";
import path from "path";
import args from "args";

// Delegate `catalog init …` to the catalog-init entry (same as running catalog-init directly).
if (process.argv[2] === "init") {
  const r = spawnSync(
    process.execPath,
    [path.join(__dirname, "catalog-init.js"), ...process.argv.slice(3)],
    { stdio: "inherit" }
  );
  process.exit(r.status === null ? 1 : r.status);
}

args
  .command("start", "Starts the Catalog server")
  .command("build", "Builds a Catalog static site")
  .command("init", "Scaffolds ./catalog from the built-in template");

args.parse(process.argv);

if (!args.sub.length) {
  // no commands
  args.showHelp();
}
