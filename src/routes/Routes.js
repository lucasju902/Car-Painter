import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { mainLayoutRoutes, authLayoutRoutes } from "./index";

import MainLayout from "layouts/Main";
import AuthLayout from "layouts/Auth";
import Page404 from "../pages/auth/Page404";

import { withAuthGuard } from "hooks";
import { withGAPageTracking } from "hooks/withGAPageTracking";

const renderChildRoutes = (Layout, routes) =>
  routes.map(
    (
      { path, component: Component, children, guarded, redirectToSignIn },
      index
    ) => {
      const ComponentLayout = withGAPageTracking(
        guarded ? withAuthGuard(Layout, redirectToSignIn) : Layout
      );

      return children ? (
        renderChildRoutes(Layout, children)
      ) : Component ? (
        <Route
          key={index}
          path={path}
          exact
          render={(props) => (
            <ComponentLayout>
              <Component {...props} />
            </ComponentLayout>
          )}
        />
      ) : null;
    }
  );

const Routes = () => (
  <Router>
    <Switch>
      {renderChildRoutes(MainLayout, mainLayoutRoutes)}
      {renderChildRoutes(AuthLayout, authLayoutRoutes)}
      <Route exact path="/scheme/:id">
        <Redirect to="/project/:id" />
      </Route>
      <Route
        render={() => (
          <AuthLayout>
            <Page404 />
          </AuthLayout>
        )}
      />
    </Switch>
  </Router>
);

export default Routes;
