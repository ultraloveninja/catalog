import PropTypes from "prop-types";
import React from "react";
import { CacheProvider } from "@emotion/react";
import {
  BrowserRouter,
  HashRouter,
  Route,
  Routes,
  useLocation
} from "react-router-dom";

import { cache } from "../emotion";
import configureRoutes from "../configureRoutes";

const RoutedPage = ({ PageComponent }) => {
  const location = useLocation();
  return <PageComponent location={location} />;
};

RoutedPage.propTypes = {
  PageComponent: PropTypes.func.isRequired
};

const CatalogInner = ({ configuration }) => {
  const location = useLocation();
  const routes = configureRoutes(configuration);
  const ConfiguredCatalogContext = routes.component;

  return (
    <ConfiguredCatalogContext location={location}>
      <Routes>
        {routes.childRoutes.map(route => (
          <Route
            key={route.path}
            path={route.path}
            element={<RoutedPage PageComponent={route.component} />}
          />
        ))}
      </Routes>
    </ConfiguredCatalogContext>
  );
};

CatalogInner.propTypes = {
  configuration: PropTypes.object.isRequired
};

const Catalog = configuration => {
  const RouterComponent = configuration.useBrowserHistory
    ? BrowserRouter
    : HashRouter;
  return (
    <CacheProvider value={cache}>
      <RouterComponent>
        <CatalogInner configuration={configuration} />
      </RouterComponent>
    </CacheProvider>
  );
};

Catalog.propTypes = {
  useBrowserHistory: PropTypes.bool
};

export default Catalog;
