import React, { Children, useEffect } from "react";
import PropTypes from "prop-types";
import { useCatalog } from "../CatalogRuntimeContext";

import AppLayout from "./AppLayout";
import Menu from "../Menu/Menu";

const getDocumentTitle = ({ title, page }) =>
  title === page.superTitle
    ? `${page.superTitle} – ${page.title}`
    : `${title} – ${page.superTitle} – ${page.title}`;

const App = ({ children }) => {
  const catalog = useCatalog();

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = getDocumentTitle(catalog);
    }
  }, [catalog]);

  return (
    <AppLayout {...catalog} sideNav={<Menu {...catalog} />}>
      {Children.only(children)}
    </AppLayout>
  );
};

App.propTypes = {
  children: PropTypes.element.isRequired
};

export default App;
