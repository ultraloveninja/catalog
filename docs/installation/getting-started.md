> Catalog v4 is driven by the **`@catalog/cli`** package. You add **`catalog`** (and React) to your app, create a small **`catalog/`** source folder, then use the CLI dev server or production build. A separate global **`create-catalog`** installer is not used in this line; set up a project with the steps below.

```hint|directive
You need **[Node.js](https://nodejs.org/) 18 or newer** and a package manager (**npm**, **yarn**, or **pnpm**).
```

```hint|neutral
On the public npm registry, **`catalog`** and **`@catalog/cli`** still use the **`canary`** dist-tag for the **v4** line. Plain **`yarn add catalog`** resolves to **`latest`**, which is the old **3.x** tree (deprecated) and **`yarn add @catalog/cli`** can resolve to a broken **0.x** release. Install with **`@canary`** (or pin **`catalog@4.0.1-canary.2`** and **`@catalog/cli@4.0.1-canary.2`**) until **`latest`** is moved to v4.
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

By default the CLI looks for a folder named **`catalog`** next to your **`package.json`**. It must contain:

- **`index.html`** — a shell page with a root element (for example `<div id="catalog"></div>`) and any CSS you need.
- **`index.js`**, **`index.ts`**, or **`index.tsx`** — a small entry that imports **`Catalog`** from **`catalog`**, defines your **`pages`**, and mounts the app with **`react-dom/client`** (see the [React API](/guides/react) guide).

Optional: a **`static/`** subtree for assets served as-is.

A minimal template ships with the CLI package as **`setup-template`** (under `node_modules/@catalog/cli/setup-template` after install). You can copy those files into **`catalog/`** and adjust them.

## 3. Run the dev server

From the **project root** (where **`package.json`** lives), run **`catalog-start`** with the **path to your Catalog sources** (a directory that contains **`index.html`** and **`index.{js,ts,tsx}`**). If you omit it, the CLI defaults to **`catalog`**.

### yarn

```code
yarn catalog-start catalog
```

### npm

```code
npx catalog-start catalog
```

Common options: **`--port`**, **`--host`**. Default port is **4000**.

Add **`package.json`** scripts so you do not rely on global installs:

```code|lang-json
{
  "scripts": {
    "catalog:start": "catalog-start catalog",
    "catalog:build": "catalog-build catalog"
  }
}
```

Then:

```code
yarn catalog:start
```

You do **not** need **`npm install -g`** for normal use. Keeping **`@catalog/cli`** in **`devDependencies`** and invoking **`catalog-start`** / **`catalog-build`** via **`yarn`** / **`npx`** is enough.

### One-off run without saving the CLI

If you only want to try the CLI without adding it to **`package.json`**, you can pull the package for a single command (npm syntax):

```code
npx --yes -p @catalog/cli catalog-start catalog
```

## 4. Production build

```code
yarn catalog-build catalog
```

Output defaults to **`catalog/build`** (override with **`--out`**). Set **`--public-url`** if assets are served from a subpath (see the [configuration](/configuration) docs).

## 5. Optional: `catalog` meta-cli

The **`catalog`** binary groups subcommands (**`start`**, **`build`**), for example **`catalog start`** when **`@catalog/cli`** is on your **`PATH`**. Many teams prefer the explicit **`catalog-start`** / **`catalog-build`** scripts above.

## Integrating with an existing React app

Catalog’s CLI serves the **`catalog/`** entry as its own webpack app. You can share components and styles from the rest of your repo via normal imports in **`catalog/index.tsx`**, as long as your dependencies and aliases resolve from the catalog entry (see [Custom Build Setup](/guides/webpack-babel) if you need to customize webpack).

## Working on the Catalog source repository

If you are developing **this** monorepo (libraries, CLI, docs site), use **yarn** at the repo root: **`yarn install`**, then **`yarn dev`** to rebuild packages in watch mode and run the in-repo docs app, or **`yarn build`** / **`yarn test`** for one-off builds and tests. See the root **`README.md`** and **`CONTRIBUTING.md`**.

In this repository, the **`docs/`** workspace is itself the Catalog project, so its **`package.json`** scripts run **`catalog-start .`** (current directory) instead of **`catalog-start catalog`**.

```hint|neutral
Older tutorials may mention **`create-catalog`** or **Node 8+**. Those referred to a legacy scaffolding flow. For v4, follow this page and the root **`README.md`** instead.
```
