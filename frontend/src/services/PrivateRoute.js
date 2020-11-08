import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, layout: Layout, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(matchProps) =>
        sessionStorage.getItem("isLogged") ? (
          <Layout>
            <Component {...matchProps} />
          </Layout>
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: matchProps.location },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
