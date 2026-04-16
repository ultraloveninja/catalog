import { createRoot } from "react-dom/client";
import { Catalog, pageLoader } from "catalog";

const pages = [
  {
    path: "/",
    title: "Welcome",
    content: pageLoader(() => import("./WELCOME.md"))
  }
];

const rootElement = document.getElementById("catalog");

if (rootElement) {
  createRoot(rootElement).render(<Catalog title="Catalog" pages={pages} />);
}
