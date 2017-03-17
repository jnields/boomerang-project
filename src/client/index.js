import React from "react";
import { render } from "react-dom";
import routes from "./routes";
import createStore from "./helpers/create-store";
import { Router, browserHistory } from "react-router";
import { Provider } from "react-redux";

render(
    <Provider store={createStore()}>
        <Router routes={routes} history={browserHistory} />
    </Provider>,
    /*eslint no-undef: 0*/
    document.getElementById("react-root")
);
