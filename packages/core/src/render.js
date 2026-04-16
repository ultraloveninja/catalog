import React from "react";
import { createRoot } from "react-dom/client";
import Catalog from "./components/Catalog";

export default (configuration, element) => {
  const root = createRoot(element);
  root.render(<Catalog {...configuration} />);
};
