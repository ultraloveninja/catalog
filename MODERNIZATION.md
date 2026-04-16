# Modernization roadmap (stepped)

Work proceeds in **phases** so each PR stays reviewable and CI stays green. Completed phases are checked off over time.

## Phase 1 — CI, docs accuracy, dead dependencies ✅ (current)

- [x] GitHub Actions workflow: Node 18 & 20, `yarn lint`, `yarn test`, `yarn build`
- [x] README: replace dead Travis badge with CI badge; align “release / CI” copy with GitHub Actions
- [x] Remove unused `@babel/polyfill` from root devDependencies

## Phase 2 — Markdown / content pipeline ✅

- [x] Upgrade **`marked`** to **v11+** and replace the old **0.4-only** `marked-react.js` lexer/parser subclasses with **`markdownReact.js`** (Lexer + React compiler aligned to marked’s token model)
- [ ] Deferred: **`markdown-it` / `micromark` + `remark`** — only revisit if we need a non–marked AST or a richer plugin ecosystem
- [x] GFM / security: raw Markdown HTML is sanitized with **`sanitize-html`** by default (`renderMarkdown({ sanitize: false })` to opt out); `renderMarkdown` forwards marked lexer options without obsolete `marked` 0.x keys
- [x] Update snapshots and markdown tests for the new pipeline

## Phase 3 — Monorepo & release tooling ✅

- [x] **`yarn install`** at the workspace root replaces **`lerna bootstrap`** (`bootstrap` script, `Makefile`, contributing docs); **Lerna 8+** retained for **`lerna version`** / **`lerna publish`**
- [x] `package.json` **`exports`** (including **`./package.json`** for manifest introspection) on **`@catalog/core`**, **`catalog`**, **`@catalog/markdown-loader`**, **`@catalog/babel-preset`**, **`@catalog/standalone`**, and **`@catalog/cli`**

## Phase 4 — Lint / types / DX ✅

- [x] **ESLint 9** root **`eslint.config.mjs`** (flat config): **`@eslint/js`**, **`typescript-eslint`** (scoped to `*.ts` / `*.tsx`), **`eslint-plugin-react`** (recommended + **jsx-runtime**), **`@babel/eslint-parser`** for `*.js` / `*.jsx`, **`eslint-config-prettier`**, **`globals`**; ignores replace **`.eslintignore`**; **`yarn lint`** no longer uses **`--ext`**
- [x] Incremental: **`eqeqeq`** (warn, `null` ignored) on **`packages/core`**; **`@typescript-eslint`** strictness relaxed for **`packages/cli`** and **`packages/babel-preset`** until types are tightened
- [ ] Optional: Playwright (or Cypress) smoke test for `catalog-build` output

## Phase 5 — Runtime dependencies polish

- [ ] Upgrade or replace Prism / code-highlighting path (`prismjs` → `shiki` / `highlight.js` as needed)
- [ ] Trim `ramda` in favor of native helpers where usage is small

---

When finishing a phase, update this file and keep **`yarn test`** + **`yarn build`** green before starting the next.
