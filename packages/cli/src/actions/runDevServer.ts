import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";

export default async (
  config: any,
  host: string,
  port: number,
  https: boolean,
  paths: any,
  proxy: void | string
): Promise<any> => {
  const compiler = webpack(config);
  const devServer = new WebpackDevServer(
    {
      compress: true,
      static: [
        { directory: paths.catalogStaticSrcDir, watch: true },
        { directory: paths.appStaticSrcDir, watch: true }
      ],
      hot: true,
      devMiddleware: {
        publicPath: config.output.publicPath
      },
      allowedHosts: "all",
      // Reportedly, this avoids CPU overload on some systems.
      // https://github.com/facebookincubator/create-react-app/issues/293
      watchFiles: [paths.catalogStaticSrcDir, paths.appStaticSrcDir],
      historyApiFallback: {
        disableDotRule: true,
        htmlAcceptHeaders: proxy ? ["text/html"] : ["text/html", "*/*"]
      } as any /* because htmlAcceptHeaders is not documented */,
      server: https ? "https" : "http",
      host,
      ...(proxy
        ? {
            proxy: [
              {
                context: () => true,
                target: proxy
              }
            ]
          }
        : {}),
      client: {
        logging: "none",
        overlay: {
          errors: true,
          warnings: false
        }
      }
    },
    compiler
  );

  // Launch WebpackDevServer.
  return new Promise<any>((resolve, reject) => {
    devServer.startCallback((err?: Error) => {
      if (err) {
        reject(err);
      } else {
        resolve(devServer);
      }
    });
  });
};
