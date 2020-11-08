import React from "react";
import { Router, Switch } from "react-router-dom";
import "./App.css";
import LoginLayout from "./layouts/LoginLayout";
import MasterLayout from "./layouts/MasterLayout";
import Login from "./pages/Login/Login";
import NoRoute from "./components/NoRoute/NoRoute";
import AppRoute from "./services/AppRoute";
import PrivateRoute from "./services/PrivateRoute";

import history from "./services/History";
import NoRouteLayout from "./layouts/NoRouteLayout";
import Users from "./pages/Users";
import Employees from "./pages/Employees";
import EmployeePrint from "./pages/Employees/print";

function App() {
  return (
    <Router history={history}>
      <Switch>
        <AppRoute exact path="/" component={Login} layout={LoginLayout} />
        <PrivateRoute
          exact
          path={"/dashboard"}
          component={Employees}
          layout={MasterLayout}
        />
        <PrivateRoute
          exact
          path={"/users"}
          component={Users}
          layout={MasterLayout}
        />
        <PrivateRoute
          exact
          path={"/employees"}
          component={Employees}
          layout={MasterLayout}
        />

        <PrivateRoute
          exact
          path={"/employees/generateFile"}
          component={EmployeePrint}
          layout={MasterLayout}
        />

        <AppRoute component={NoRoute} layout={NoRouteLayout} />
      </Switch>
    </Router>
  );
}

export default App;
