> Catalog v4 is driven by the **`@catalog/cli`** package. You add **`catalog`** (and React) to your app, create a small **`catalog/`** source folder, then use the CLI dev server or production build. A separate global **`create-catalog`** installer is not used in this line; set up a project with the steps below.

```hint|directive
You need **[Node.js](https://nodejs.org/) 18 or newer** and a package manager (**npm**, **yarn**, or **pnpm**).
```

```hint|neutral
On the public npm registry, **`catalog`** and **`@catalog/cli`** still use the **`canary`** dist-tag for the **v4** line. Plain **`yarn add catalog`** resolves to **`latest`**, which is the old **3.x** tree (deprecated) and **`yarn add @catalog/cli`** can resolve to a broken **0.x** release. Install with **`@canary`** (or pin a **`4.0.x-canary.*`** version) until **`latest`** is moved to v4.

A given **`canary`** tarball only updates when a maintainer **publishes** a new version. Features merged on GitHub (for example **`catalog-init`**) are not available from **`yarn add @catalog/cli@canary`** until that publish happens. Until then, use **`yarn link @catalog/cli`** from a local clone after **`yarn build:lib`**, or a **`file:`** / **git** dependency on this repo.
```

## 1. Install packages

In your project root, add the runtime library and peer dependencies, and add the CLI as a **development** dependency (it wraps webpack and the dev server).

### yarn

```code
yarn add catalog@canary react react-dom
yarn add -D @catalog/cli@canary
```

### npm

```code
npm install catalog@canary react react-dom --save
npm install @catalog/cli@canary --save-dev
```

### pnpm

```code
pnpm add catalog@canary react react-dom
pnpm add -D @catalog/cli@canary
```

## 2. Add a `catalog` source directory

By default the CLI looks for a folder named **`catalog`** next to your **`package.json`**. It must contain **`index.html`**, **`index.js`** (or **`.ts`** / **`.tsx`**), and optionally **`static/`**.

### Scaffold with **`catalog-init`** (recommended)

From the project root, run **`catalog-init`** once. It copies the built-in **`setup-template`** into **`./catalog/`** (or pass another directory name as the first argument).

**Yarn v1 does not run dependency binaries when you type `yarn catalog-init`** — that looks for a **`scripts.catalog-init`** entry in **`package.json`**, which does not exist by default. Use one of these instead:

```code
npx catalog-init
```

```code
./node_modules/.bin/catalog-init
```

Or add a script (see [§3](#3-run-the-dev-server)) and run **`yarn catalog:init`**.

If your installed **`@catalog/cli`** predates the **`catalog-init`** publish, **`npx catalog-init`** will fail (binary missing). Use **`cp -R node_modules/@catalog/cli/setup-template/. catalog/`** or link a newer build from this repository.

If **`index.html`** already exists there, pass **`--force`** to replace it with the template again.

When the **`catalog`** binary on your **`PATH`** includes **`init`**, **`npx catalog init`** runs the same scaffold as **`catalog-init`** (it forwards to **`catalog-init`**).

### Manual copy (optional)

The same files live under **`node_modules/@catalog/cli/setup-template`** after install. You can **`cp -R`** that folder’s contents into **`catalog/`** instead of using **`catalog-init`**.

### What you get

- **`index.html`** — shell page with a root element (for example `<div id="catalog"></div>`).
- **`index.js`** (or rename to **`.ts`** / **`.tsx`**) — entry that imports **`Catalog`** from **`catalog`**, defines **`pages`**, and mounts with **`react-dom/client`** (see the [React API](/guides/react) guide).
- **`static/`** — sample assets (optional to extend).

## 3. Run the dev server

From the **project root** (where **`package.json`** lives), run **`catalog-start`** with the **path to your Catalog sources** (a directory that contains **`index.html`** and **`index.{js,ts,tsx}`**). If you omit it, the CLI defaults to **`catalog`**.

Common options: **`--port`**, **`--host`**. Default port is **4000**.

### Without **`package.json`** scripts (npm / npx)

```code
npx catalog-start catalog
```

### With **`package.json`** scripts (recommended for Yarn v1)

Yarn classic resolves **`yarn something`** to **`scripts.something`**, not to **`node_modules/.bin`**. Add scripts that call the binaries:

```code|lang-json
{
  "scripts": {
    "catalog:init": "catalog-init",
    "catalog:start": "catalog-start catalog",
    "catalog:build": "catalog-build catalog"
  }
}
```

Then:

```code
yarn catalog:init
yarn catalog:start
```

You do **not** need **`npm install -g`** for normal use. Keeping **`@catalog/cli`** in **`devDependencies`** and invoking the binaries via **`npx`** or **`package.json`** scripts is enough.

### One-off run without saving the CLI

If you only want to try the CLI without adding it to **`package.json`**, you can pull the package for a single command (npm syntax):

```code
npx --yes -p @catalog/cli catalog-start catalog
```

## 4. Production build

```code
npx catalog-build catalog
```

Or **`yarn catalog:build`** if you added the script in [§3](#3-run-the-dev-server).

Output defaults to **`catalog/build`** (override with **`--out`**). Set **`--public-url`** if assets are served from a subpath (see the [configuration](/configuration) docs).

## 5. Optional: `catalog` meta-cli

The **`catalog`** binary lists subcommands (**`start`**, **`build`**, **`init`**). **`catalog init`** runs the same scaffold as **`catalog-init`**. Many teams still prefer explicit **`catalog-start`** / **`catalog-build`** / **`catalog-init`** scripts in **`package.json`**.

## Integrating with an existing React app

Catalog’s CLI serves the **`catalog/`** entry as its own webpack app. You can share components and styles from the rest of your repo via normal imports in **`catalog/index.tsx`**, as long as your dependencies and aliases resolve from the catalog entry (see [Custom Build Setup](/guides/webpack-babel) if you need to customize webpack).

## Working on the Catalog source repository

If you are developing **this** monorepo (libraries, CLI, docs site), use **yarn** at the repo root: **`yarn install`**, then **`yarn dev`** to rebuild packages in watch mode and run the in-repo docs app, or **`yarn build`** / **`yarn test`** for one-off builds and tests. See the root **`README.md`** and **`CONTRIBUTING.md`**.

In this repository, the **`docs/`** workspace is itself the Catalog project, so its **`package.json`** scripts run **`catalog-start .`** (current directory) instead of **`catalog-start catalog`**.

```hint|neutral
Older tutorials may mention **`create-catalog`** or **Node 8+**. Those referred to a legacy scaffolding flow. For v4, follow this page and the root **`README.md`** instead.
```
