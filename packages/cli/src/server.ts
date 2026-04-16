import { exists } from "sander";
import choosePort from "./utils/choosePort";
import openBrowser from "./utils/openBrowser";

import { infoMessageDimmed } from "./utils/format";

import loadWebpackConfig from "./actions/loadWebpackConfig";
import loadConfigFile from "./actions/loadConfigFile";
import loadPaths from "./actions/loadPaths";

import setupCatalog from "./actions/setupCatalog";
import runDevServer from "./actions/runDevServer";

export interface Options {
  port: number;
  https: boolean;
  host: string;
  proxy: void | string;
  babelrc: void | boolean;
}

export interface Server {
  port: number;
  url: string;
  devServer: any;
}

export const startServer = async (
  catalogSrcDir: string = "catalog",
  options: Options
): Promise<Server> => {
  const configFile = await loadConfigFile();

  const paths = await loadPaths(catalogSrcDir, "", "/");

  const port = await choosePort("0.0.0.0", options.port);
  if (port === null) {
    throw new Error(
      `Could not find a free port starting at ${options.port} (tried 30 ports).`
    );
  }

  const url =
    (options.https ? "https" : "http") +
    "://" +
    options.host +
    ":" +
    port +
    "/";

  const babelrcExists: boolean = await exists(paths.babelrc);

  const useBabelrc =
    options.babelrc !== undefined
      ? options.babelrc
      : configFile && configFile.useBabelrc !== undefined
      ? configFile.useBabelrc
      : babelrcExists;

  const webpackOptions = { paths, dev: true, url, useBabelrc };

  let webpackConfig = await loadWebpackConfig(webpackOptions);

  if (configFile) {
    if (typeof configFile.webpack === "function") {
      webpackConfig = configFile.webpack(webpackConfig, webpackOptions);
    }
  }

  await setupCatalog(paths);

  console.log(`
  Starting Catalog …
`);
  if (configFile) {
    console.log(
      infoMessageDimmed("  Using configuration file catalog.config.js")
    );
  }
  if (useBabelrc) {
    console.log(infoMessageDimmed("  Using custom .babelrc"));
  }

  const devServer = await runDevServer(
    webpackConfig,
    options.host,
    port,
    options.https,
    paths,
    options.proxy
  );

  void openBrowser(url);

  return { port, url, devServer };
};

export const stopServer = async (server: Server) => {
  if (typeof server.devServer.stop === "function") {
    await server.devServer.stop();
  } else if (typeof server.devServer.close === "function") {
    server.devServer.close();
  }
};
