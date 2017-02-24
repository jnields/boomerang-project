import React from "react";
import { Route } from "react-router";
import App from "./containers/app";
import Login from "./containers/login";

export default (
    <Route path ="/" component={App}>
        <Route path="login" component={Login}/>
    </Route>
);
