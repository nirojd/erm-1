import React from "react";
import { Route, Switch } from "react-router-dom";
import NoRoute from "../components/NoRoute/NoRoute";
import Dashboard from "../pages/Dashboard/Dashboard";
import PrivateRoute from "./PrivateRoute";

function routes() {
  return (
    <div>
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
        <Route component={NoRoute} />
        <PrivateRoute path="/dashboard" component={Dashboard} />
      </Switch>
    </div>
  );
}

export default routes;
