import React from "react";
import { Route, IndexRoute } from "react-router";

import App from "./containers/app";
import Home from "./containers/home";
import SchoolList from "./containers/school-list";
import SchoolUserManagement from "./containers/school-user-management";
import Login from "./containers/login";

export default (
    <Route path ="/" component={App}>
        <IndexRoute component={Home}/>
        <Route path="login" component={Login}/>
        <Route path="schools" component={SchoolList}>
            <Route path=":id" component={SchoolUserManagement}/>
        </Route>
    </Route>
);
