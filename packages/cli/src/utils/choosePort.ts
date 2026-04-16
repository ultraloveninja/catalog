import net from "net";

const MAX_TRIES = 30;

function portFree(host: string, port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.unref();
    server.once("error", () => resolve(false));
    server.listen({ port, host, exclusive: true }, () => {
      server.close(() => resolve(true));
    });
  });
}

/**
 * Picks an available TCP port, starting at `defaultPort` and scanning upward.
 * Unlike Create React App, this does not prompt interactively when the port is busy.
 */
export default async function choosePort(
  host: string,
  defaultPort: number
): Promise<number | null> {
  for (let i = 0; i < MAX_TRIES; i += 1) {
    const port = defaultPort + i;
    if (await portFree(host, port)) {
      return port;
    }
  }
  return null;
}
