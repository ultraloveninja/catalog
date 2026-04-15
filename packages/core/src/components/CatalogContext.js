import PropTypes from "prop-types";
import React, { Children } from "react";
import App from "./App/App";
import { CatalogRuntimeContext } from "./CatalogRuntimeContext";

const fallbackPathRe = /\*$/;
const stripTrailingSlash = path =>
  path.length > 1 ? path.replace(/\/+$/, "") : path;

const isActivePath = (routePath, pathname) => {
  if (!routePath) {
    return false;
  }

  if (fallbackPathRe.test(routePath)) {
    const routeBase = stripTrailingSlash(routePath.replace(/\*$/, ""));
    const current = stripTrailingSlash(pathname);
    return routeBase === "" || current.indexOf(routeBase) === 0;
  }

  return stripTrailingSlash(routePath) === stripTrailingSlash(pathname);
};

const CatalogContextProvider = ({ configuration, location, children }) => {
  const {
    title,
    theme,
    responsiveSizes,
    logoSrc,
    pages,
    pageTree,
    specimens,
    basePath,
    publicUrl,
    useBrowserHistory
  } = configuration;
  const activePage =
    pages.find(p => isActivePath(p.path, location.pathname)) ||
    pages.find(p => fallbackPathRe.test(p.path));

  const contextValue = {
    catalog: {
      page: activePage,
      getSpecimen: specimen => specimens[specimen],
      theme,
      responsiveSizes,
      title,
      pages: pages.filter(p => !p.hideFromMenu),
      pagePaths: new Set(pages.map(p => p.path)), // Used for internal link lookup
      pageTree,
      basePath,
      publicUrl,
      logoSrc,
      useBrowserHistory,
      currentPath: location.pathname
    },
    router: {
      isActive: path => isActivePath(path, location.pathname)
    }
  };

  return (
    <CatalogRuntimeContext.Provider value={contextValue}>
      {Children.only(children)}
    </CatalogRuntimeContext.Provider>
  );
};

CatalogContextProvider.propTypes = {
  configuration: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired
};

export default function createCatalogContext(config) {
  const ConfiguredCatalogContext = ({ children, location }) => (
    <CatalogContextProvider configuration={config} location={location}>
      <App>{children}</App>
    </CatalogContextProvider>
  );

  ConfiguredCatalogContext.propTypes = {
    children: PropTypes.element.isRequired,
    location: PropTypes.object.isRequired
  };

  return ConfiguredCatalogContext;
}
