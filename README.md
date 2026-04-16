<div align="center">
  <h3>⚠️ Deprecation Notice ⚠️</h3>
</div>

The **Catalog** project has been deprecated and is no longer under active development or maintenance.
Existing users may continue to use it at their own discretion, but no further updates or support will be provided.

For new work, consider alternatives below (depending on your goals — component “playgrounds”, design-system docs, or UI documentation).

- [**Storybook**](https://storybook.js.org/) — The most widely used UI component explorer with a rich ecosystem of addons. Great for React, Vue, and other frameworks.
- [**Ladle**](https://ladle.dev/) — Lightweight, fast alternative to Storybook built on Vite. Minimal configuration, simple setup.
- [**Zeroheight**](https://zeroheight.com/) — Design-system documentation platform used by designers; integrates tightly with Figma and design tokens.
- [**Supernova**](https://supernova.io/) — Professional design-system management platform combining docs, tokens, and code.
- [**GitBook**](https://www.gitbook.com/) — Hosted documentation platform with excellent UX and collaboration features. Great for design system and product documentation.
- [**Docusaurus**](https://docusaurus.io/) — Open-source static site generator for documentation, built with React and Markdown. Excellent for technical or design system sites.

---

![Catalog Logo](https://interactivethings.github.io/catalog/docs/assets/catalog_logo.svg)

[![CI](https://github.com/interactivethings/catalog/actions/workflows/ci.yml/badge.svg)](https://github.com/interactivethings/catalog/actions/workflows/ci.yml) [![Downloads](https://img.shields.io/npm/dm/catalog.svg)](https://www.npmjs.com/package/catalog) [![Version](https://img.shields.io/npm/v/catalog.svg)](https://www.npmjs.com/package/catalog) [![License](https://img.shields.io/npm/l/catalog.svg)](https://www.npmjs.com/package/catalog)

> 🚧 This is the currently in-development v4 branch. Stable code is in [master](https://github.com/interactivethings/catalog/tree/master).

# Catalog

Catalog lets you create beautiful living and fully interactive style guides using Markdown and React components.

Please read the [Catalog documentation](https://docs.catalog.style/) (built with Catalog!) for detailed installation and usage instructions.

## Installation

Add the **`catalog`** package plus React. To run the webpack-based dev server and production build, also add **`@catalog/cli`** as a dev dependency and create a **`catalog/`** source directory; see **`docs/installation/getting-started.md`** (or the **Getting started** page in the docs site when you run **`yarn dev`**).

Published **v4** builds use the **`canary`** dist-tag on npm ( **`latest`** still points at old **3.x** / **0.x** ). Use **`@canary`** below, or pin **`4.0.1-canary.2`**, until **`latest`** is updated.

### yarn

```
yarn add catalog@canary react react-dom
yarn add -D @catalog/cli@canary
```

### npm

```
npm install catalog@canary react react-dom --save
npm install @catalog/cli@canary --save-dev
```

## Development

> Use **Node.js 18 or newer** and [yarn](https://yarnpkg.com/). Catalog’s dev server and published libraries target **modern evergreen browsers** (see the repo root `browserslist`); **Internet Explorer is not supported**.

Planned upgrades are tracked in [`MODERNIZATION.md`](./MODERNIZATION.md) (phased checklist).

### Install and run everything in watch mode

From the repository root:

```
yarn install
yarn dev
```

`yarn dev` runs Rollup in watch mode for all libraries **and** starts the in-repo documentation app in [`docs/`](./docs/) (which uses the locally built CLI under `packages/cli/dist/`). Use this while you change core, CLI, or docs sources.

### One-off build and docs

Match CI or produce artifacts without watch:

```
yarn build
```

To serve the docs site from an existing build (without `yarn dev`):

```
yarn workspace @catalog/docs run dev
```

### Linking

When developing Catalog you want to link it locally:

```
yarn link
```

You can then link to this version in your project (or one of the examples):

```
yarn link catalog
```

### Tests and lint

CI runs **`yarn lint`**, **`yarn test`**, and **`yarn build`**. Locally:

```
yarn test
yarn lint
```

To run Jest in watch mode:

```
./node_modules/.bin/jest --watch
```

## Creating a Release

Bump versions with [Lerna](https://lerna.js.org/) from the repository root (see also [`CONTRIBUTING.md`](./CONTRIBUTING.md)):

```
yarn lerna version
```

Then push including tags:

```
git push && git push --tags
```

**GitHub Actions** runs tests and builds on push and pull requests (see `.github/workflows/ci.yml`). Publishing to npm is separate from this workflow.

## Optional: Makefile

The root **`Makefile`** only forwards to Yarn for convenience:

```
make    # runs: yarn install && yarn dev
```

## Credits

Catalog is developed by [many people](https://github.com/interactivethings/catalog/blob/master/AUTHORS) at [Interactive Things](https://www.interactivethings.com/), a User Experience and Data Visualization Studio based in Zürich.
