import React from "react";
import { render } from "react-dom";
import routes from "./routes";
import { Router, browserHistory } from "react-router";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducers from "./reducers";

const store = createStore(
    reducers,
    window.__INITIAL_STATE__,
    applyMiddleware(thunk)
);

delete window.__INITIAL_STATE__;

render(
    <Provider store={store}>
        <Router routes={routes} history={browserHistory} />
    </Provider>,
    document.getElementById("react-root")
);
