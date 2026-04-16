import open from "open";

/**
 * Opens the given URL in the system browser (honours `BROWSER=none` like CRA).
 */
export default async function openBrowser(url: string): Promise<void> {
  const browser = process.env.BROWSER;
  if (browser && browser.toLowerCase() === "none") {
    return;
  }
  await open(url, { wait: false });
}
