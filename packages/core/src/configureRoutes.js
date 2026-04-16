import React from "react";
import { Outlet, Route, useLocation } from "react-router-dom";
import configure from "./configure";
import warning from "./utils/warning";
import requireModuleDefault from "./utils/requireModuleDefault";
import CatalogContext from "./components/CatalogContext";
import pageLoader from "./pageLoader";

const pageToRoute = ({ path, component, src }) => ({
  component: component ? requireModuleDefault(component) : pageLoader(src),
  path
});

const RoutedElement = ({ PageComponent }) => {
  const location = useLocation();
  return <PageComponent location={location} />;
};

const pageToJSXRoute = ({ path, component, src }) => (
  <Route
    key={path}
    path={path}
    element={
      <RoutedElement
        PageComponent={
          component ? requireModuleDefault(component) : pageLoader(src)
        }
      />
    }
  />
);

const createConfiguredCatalogContextWithOutlet = config => {
  const ConfiguredCatalogContext = CatalogContext(config);
  const ConfiguredLayout = () => {
    const location = useLocation();
    return (
      <ConfiguredCatalogContext location={location}>
        <Outlet />
      </ConfiguredCatalogContext>
    );
  };

  return ConfiguredLayout;
};

const autoConfigure = config => {
  warning(
    !config.__catalogConfig,
    "The `configure` function is deprecated; use `configureRoutes` or `configureJSXRoutes` directly."
  );

  return config.__catalogConfig ? config : configure(config);
};

export default config => {
  const finalConfig = autoConfigure(config);
  return {
    component: CatalogContext(finalConfig),
    childRoutes: finalConfig.pages.map(pageToRoute)
  };
};

export const configureJSXRoutes = config => {
  const finalConfig = autoConfigure(config);
  const ConfiguredLayout = createConfiguredCatalogContextWithOutlet(finalConfig);
  return (
    <Route element={<ConfiguredLayout />}>
      {finalConfig.pages.map(pageToJSXRoute)}
    </Route>
  );
};
