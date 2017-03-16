import React from "react";
import { Route, IndexRoute } from "react-router";

import App from "./containers/app";
import Home from "./containers/home";
import SchoolManagement from "./containers/school-management";
import Login from "./containers/login";

export default (
    <Route path ="/" component={App}>
        <IndexRoute component={Home}/>
        <Route path="login" component={Login}/>
        <Route path="schools/:id?" component={SchoolManagement}/>
    </Route>
);
