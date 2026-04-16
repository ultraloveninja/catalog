> For customized build setups, Catalog provides a [webpack](https://webpack.js.org/) loader and a [Babel](http://babeljs.io/) preset

This is for the adventurous who don't shy away from configuring webpack! Use this guide if you:

- have a custom webpack/Babel setup already
- need to use specific webpack loaders (e.g. for TypeScript) or Babel transforms

```hint|directive
You _don't_ need a custom setup if you're using Catalog on its own with the default **`@catalog/cli`** dev server (see [Getting started](/installation/getting-started)). If Catalog lives inside a larger app (for example [Create React App](https://github.com/facebook/create-react-app) or [Next.js](https://nextjs.org/)), you usually still use the **`catalog/`** folder plus **`catalog-start`** / **`catalog-build`**, or you wire Catalog into your own bundler using this guide when you need full control.
```

## `catalog.config.js`

If you use the Catalog command line scripts (`catalog start` and `catalog build`), you can add a `catalog.config.js` file to modify Catalog's generated webpack configuration. This is useful when you want to add another webpack loader or plugin.

Example `catalog.config.js`:

```code|lang-js
module.exports = {
  webpack: (catalogWebpackConfig, {paths, dev, framework}) => {
    // Modify catalogWebpackConfig ...
    return modifiedWebpackConfig;
  }
}
```

```hint|warning
# Warning

Modifying a webpack configuration is tricky! Only do this if you know what you're doing! We don't make any guarantees that the shape of Catalog's webpack configuration will stay stable, so it's probably a good idea to lock Catalog to an exact version in your `package.json` to prevent unexpected results when Catalog updates.
```

## Webpack loader

Catalog's webpack loader allows you to import Markdown files as pages.

```code|lang-javascript
{
  // Other webpack config ...
  module: {
    rules: [
      {
        test: /\.md$/,
        use: ['@catalog/markdown-loader']
      }
    ]
  }
};
```

## Babel preset

Catalog's Babel preset ensures that JSX source code of [ReactSpecimens](/specimens/react) is preserved.

Add `@catalog/babel-preset` to your presets in `.babelrc`

```code|lang-javascript
{
  "presets": ["@catalog/babel-preset"]
}
```

Don't forget to install the preset via:

```
npm i -D @catalog/babel-preset
```
