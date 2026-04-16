# Setup

### 1. Install dependencies

From the repository root (Yarn workspaces link packages automatically):

```
yarn install
```

### 2. (Optional) Use the `bootstrap` script

`yarn bootstrap` is an alias for `yarn install` and exists for muscle memory from older Lerna-based setups.

### 3. Start the tests in watch mode

```
./node_modules/.bin/jest --watch
```

### 4. Start the docs catalog

This starts Rollup in watch mode for all packages **and** the local Catalog site in the `docs/` folder. Use it to exercise changes to core, the CLI, or documentation.

```
yarn dev
```

(`make` at the repo root runs `yarn install && yarn dev` if you prefer the Makefile shortcut.)

# Release

Releasing is done manually. We currently publish two kinds of releases: canary (alpha) and latest (stable, production-ready).

### How the npm registry “catches up”

**GitHub and npm are separate.** Pushing commits to a branch does **not** change what **`yarn add @catalog/cli`** installs. A maintainer with **`npm publish`** rights (usually via **Lerna** from this repo) must publish a new version; only then does the registry serve new bits. Dist-tags such as **`canary`** or **`latest`** are updated at publish time.

Forks without publish access can still consume the source via **`git`**, **`yarn link`**, or **`file:`** dependencies until a package owner publishes.

TODO: The release process should eventually be automated through CI.

### Canary

Canary releases are published under the npm dist-tag `canary` and a semver tag `-alpha.N`.

```
./node_modules/.bin/tsc --build packages
make build -C packages/core build
make build -C packages/standalone build
./node_modules/.bin/lerna publish --canary
```

### Latest

The following steps publish all packages under a new version.

```
./node_modules/.bin/lerna version
./node_modules/.bin/tsc --build packages
make build -C packages/core build
make build -C packages/standalone build
./node_modules/.bin/lerna publish from-git
```
