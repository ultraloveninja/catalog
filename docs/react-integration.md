> With Catalog you can develop React components directly in your style guide, enable hot-reloading documentation writing, and integrate Catalog in an existing application.

```hint
This section assumes that you have a working development setup with npm, webpack and a ES2015 transpiler (for example Babel).
```




## Advanced Integration

> If you need more control over the integration into your application, Catalog is flexible enough to supports some advanced use cases.

### React Router Routes

The `Catalog` component creates routes and renders React Router with a few presets internally. But with `configureRoutes` you can also generate Catalog routes, so you can

- mix them with other routes,
- use them for server-side rendering,
- configure `Router` however you like.

```code|lang-jsx
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Routes, Route, useLocation} from 'react-router-dom';
import {configureRoutes} from 'catalog';

const catalogRoutes = configureRoutes({
  title: 'My Styleguide',
  basePath: '/catalog',
  pages: [/* ... */]
});

const CatalogRoutedPage = ({PageComponent}) => {
  const location = useLocation();
  return <PageComponent location={location} />;
};

const CatalogLayout = catalogRoutes.component;

const AppRoutes = () => {
  const location = useLocation();
  return (
    <CatalogLayout location={location}>
      <Routes>
        {catalogRoutes.childRoutes.map(route => (
          <Route
            key={route.path}
            path={route.path}
            element={<CatalogRoutedPage PageComponent={route.component} />}
          />
        ))}
        {/* other routes ... */}
      </Routes>
    </CatalogLayout>
  );
};

ReactDOM.render(
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>,
  document.getElementById('app')
);
```

`configureRoutes` returns a React Router v7-friendly object:

- `component`: Catalog layout wrapper component. Pass it the current `location`.
- `childRoutes`: route descriptors with `{ path, component }`. Each `component` expects `{ location }`.

For JSX-first route composition, use `configureJSXRoutes(config)` and render the returned `<Route />` subtree directly.
