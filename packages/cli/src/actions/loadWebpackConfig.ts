import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { WebpackManifestPlugin } from "webpack-manifest-plugin";

import getCSSModuleLocalIdent from "react-dev-utils/getCSSModuleLocalIdent";
import InterpolateHtmlPlugin from "react-dev-utils/InterpolateHtmlPlugin";

import getClientEnvironment from "../config/env";

type LoadWebpackOptions = {
  paths: any;
  dev: boolean;
  useBabelrc: boolean;
  url?: string;
};
type WebpackConfig = {};

const shouldUseSourceMap = true;

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

// FIXME: detect when this should be true
const shouldUseRelativeAssetPaths = false;

// common function to get style loaders
const getStyleLoaders = ({
  cssOptions,
  preProcessor,
  dev
}: {
  cssOptions: any;
  preProcessor?: string;
  dev: boolean;
}) => {
  const loaders = [
    dev && require.resolve("style-loader"),
    !dev && {
      loader: MiniCssExtractPlugin.loader,
      options: Object.assign(
        {},
        shouldUseRelativeAssetPaths ? { publicPath: "../../" } : undefined
      )
    },
    {
      loader: require.resolve("css-loader"),
      options: cssOptions
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve("postcss-loader"),
      options: {
        postcssOptions: {
          plugins: [
            require("postcss-flexbugs-fixes"),
            require("postcss-preset-env")({
              autoprefixer: {
                flexbox: "no-2009"
              },
              stage: 3
            })
          ]
        },
        sourceMap: !dev && shouldUseSourceMap
      }
    }
  ].filter(Boolean);
  if (preProcessor) {
    loaders.push({
      loader: require.resolve(preProcessor),
      options: {
        implementation: require("sass"),
        sourceMap: !dev && shouldUseSourceMap
      }
    });
  }
  return loaders;
};

export default async ({
  paths,
  dev,
  url,
  useBabelrc
}: LoadWebpackOptions): Promise<WebpackConfig> => {
  const env = getClientEnvironment(paths.publicUrl.replace(/\/$/, ""));

  const devPlugins = dev
    ? [new webpack.HotModuleReplacementPlugin()]
    : [];

  return {
    mode: dev ? "development" : "production",
    devtool: dev ? "cheap-module-source-map" : "source-map",
    bail: dev ? false : true,
    entry: {
      catalog: [require.resolve("react-app-polyfill/ie11")].concat(
        paths.catalogIndexJs
      )
    },
    output: {
      path: paths.catalogBuildDir,
      pathinfo: dev ? true : false,
      filename: dev ? "static/[name].js" : "static/[name].[chunkhash:8].js",
      chunkFilename: dev
        ? "static/[name].chunk.js"
        : "static/[name].[chunkhash:8].chunk.js",
      // This is the URL that app is served from. We use "/" in development.
      publicPath: paths.publicUrl
    },
    resolve: {
      modules: [paths.appSrc, "node_modules", paths.appNodeModules].concat(
        paths.nodePaths
      ),
      extensions: [".mjs", ".js", ".ts", ".tsx", ".json", ".jsx"],
      alias: {
        // Support React Native Web
        // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
        "react-native": "react-native-web",
        "babel-standalone": "babel-standalone/babel.min.js",
        "js-yaml": "js-yaml/dist/js-yaml.min.js"
      }
    },
    resolveLoader: {
      modules: [paths.ownNodeModules, paths.appNodeModules]
    },
    module: {
      rules: [
        {
          oneOf: [
            // "url" loader works like "file" loader except that it embeds assets
            // smaller than specified limit in bytes as data URLs to avoid requests.
            // A missing `test` is equivalent to a match.
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              type: "asset",
              parser: {
                dataUrlCondition: {
                  maxSize: 10000
                }
              },
              generator: {
                filename: "static/media/[name].[contenthash:8][ext]"
              }
            },
            // Process JS with Babel.
            {
              test: /\.(mjs|js|jsx|ts|tsx)$/,
              include: [paths.appRoot, paths.catalogSrcDir],
              exclude: /node_modules/,
              loader: require.resolve("babel-loader"),
              options: {
                babelrc: useBabelrc,
                presets: useBabelrc
                  ? []
                  : [
                      require.resolve("babel-preset-react-app"),
                      require.resolve("@catalog/babel-preset")
                    ],
                cacheDirectory: false
              }
            },
            // "postcss" loader applies autoprefixer to our CSS.
            // "css" loader resolves paths in CSS and adds assets as dependencies.
            // "style" loader turns CSS into JS modules that inject <style> tags.
            // In production, we use MiniCSSExtractPlugin to extract that CSS
            // to a file, but in development "style" loader enables hot editing
            // of CSS.
            // By default we support CSS Modules with the extension .module.css
            {
              test: cssRegex,
              exclude: cssModuleRegex,
              use: getStyleLoaders({
                cssOptions: {
                  importLoaders: 1,
                  sourceMap: !dev && shouldUseSourceMap
                },
                dev
              }),
              // Don't consider CSS imports dead code even if the
              // containing package claims to have no side effects.
              // Remove this when webpack adds a warning or an error for this.
              // See https://github.com/webpack/webpack/issues/6571
              sideEffects: true
            },
            // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
            // using the extension .module.css
            {
              test: cssModuleRegex,
              use: getStyleLoaders({
                cssOptions: {
                  importLoaders: 1,
                  sourceMap: !dev && shouldUseSourceMap,
                  modules: {
                    getLocalIdent: getCSSModuleLocalIdent
                  }
                },
                dev
              })
            },
            // Opt-in support for SASS (using .scss or .sass extensions).
            // By default we support SASS Modules with the
            // extensions .module.scss or .module.sass
            {
              test: sassRegex,
              exclude: sassModuleRegex,
              use: getStyleLoaders({
                cssOptions: {
                  importLoaders: 2,
                  sourceMap: !dev && shouldUseSourceMap
                },
                preProcessor: "sass-loader",
                dev
              }),
              // Don't consider CSS imports dead code even if the
              // containing package claims to have no side effects.
              // Remove this when webpack adds a warning or an error for this.
              // See https://github.com/webpack/webpack/issues/6571
              sideEffects: true
            },
            // Adds support for CSS Modules, but using SASS
            // using the extension .module.scss or .module.sass
            {
              test: sassModuleRegex,
              use: getStyleLoaders({
                cssOptions: {
                  importLoaders: 2,
                  sourceMap: !dev && shouldUseSourceMap,
                  modules: {
                    getLocalIdent: getCSSModuleLocalIdent
                  }
                },
                preProcessor: "sass-loader",
                dev
              })
            },
            {
              test: /\.md$/,
              loader: require.resolve("@catalog/markdown-loader")
            },
            {
              exclude: [/\.mjs$/, /\.js$/, /\.html$/, /\.json$/, /\.md$/],
              type: "asset/resource",
              generator: {
                filename: "static/media/[name].[contenthash:8][ext]"
              }
            }
          ]
        }
      ]
    },
    plugins: (dev
      ? []
      : [
          new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "static/css/[name].[contenthash:8].css",
            chunkFilename: "static/css/[name].[contenthash:8].chunk.css"
          }),
          new WebpackManifestPlugin({
            fileName: "asset-manifest.json"
          })
        ]
    ).concat([
      new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
      new HtmlWebpackPlugin({
        inject: true,
        template: paths.catalogIndexHtml,
        minify: dev
          ? false
          : {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true
            }
      }),
      new webpack.DefinePlugin(env.stringified),
      // This is necessary to emit hot updates (currently CSS only):

      ...devPlugins
    ]),
    performance: {
      hints: false
    },
    optimization: {
      minimize: !dev,
      minimizer: [
        // This is only used in production mode
        new TerserPlugin({
          terserOptions: {
            parse: {
              // we want terser to parse ecma 8 code. However, we don't want it
              // to apply any minfication steps that turns valid ecma 5 code
              // into invalid ecma 5 code. This is why the 'compress' and 'output'
              // sections only apply transformations that are ecma 5 safe
              // https://github.com/facebook/create-react-app/pull/4234
              ecma: 8
            },
            compress: {
              ecma: 5,
              // Disabled because of an issue with Uglify breaking seemingly valid code:
              // https://github.com/facebook/create-react-app/issues/2376
              // Pending further investigation:
              // https://github.com/mishoo/UglifyJS2/issues/2011
              comparisons: false,
              // Disabled because of an issue with Terser breaking valid code:
              // https://github.com/facebook/create-react-app/issues/5250
              // Pending futher investigation:
              // https://github.com/terser-js/terser/issues/120
              inline: 2
            },
            mangle: {
              safari10: true
            },
            output: {
              ecma: 5,
              comments: false,
              // Turned on because emoji and regex is not minified properly using default
              // https://github.com/facebook/create-react-app/issues/2488
              ascii_only: true
            }
          },
          // Use multi-process parallel running to improve the build speed
          // Default number of concurrent runs: os.cpus().length - 1
          parallel: true
        })
      ],
      // Automatically split vendor and commons
      // https://twitter.com/wSokra/status/969633336732905474
      // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
      splitChunks: {
        chunks: "all",
        name: false
      },
      // Keep the runtime chunk separated to enable long term caching
      // https://twitter.com/wSokra/status/969679223278505985
      runtimeChunk: true
    }
  };
};
