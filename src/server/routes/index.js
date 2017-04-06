import { Router } from "express";
import React from "react";
import { renderToString } from "react-dom/server";
import { match, RouterContext } from "react-router";
import { Provider } from "react-redux";
import { createStore } from "redux";

import api from "./api";
import routes from "../../client/routes";
import reducers from "../../client/reducers";

const env = process.env.NODE_ENV || "development";

export default Promise.resolve(api).then(resolvedApi => {
    return {
        "/api": resolvedApi,
        "/": getPageRouter()
    };
});

function getPageRouter() {
    const router = Router();
    router.get("*", function(req, res) {
        if (req.user == null && !/\/login/i.test(req.originalUrl)) {
            return res.redirect("/login");
        }
        match({ routes, location: req.url }, (err, redirect, props) => {
            if (err) {
                return res.status(500).send(err.message);
            } else if (redirect) {
                return res.redirect(redirect.pathname + redirect.search);
            } else if (!props) {
                return res.render("404");
            }

            const initialState = {
                    authorization: {
                        authorizing: false,
                        authorized: req.user != null,
                        invalidAttempt: false,
                        loggingOut: false,
                        logOutFail: false,
                        user: req.user,
                        school: req.school
                    }
                },
                store = createStore(reducers,initialState);
            store.dispatch({type:"__INIT_STATE__"});

            const options = {
                title: "Express",
                lang: "en",
                initialState: JSON
                    .stringify(initialState)
                    .replace(/</g, "\\u003c")
            };


            if (env === "development") {
                options.bundlePath = "/hot-reload-server/bundle.js";
                options.markup = "";
            } else {
                options.bundlePath = "/public/build/bundle.js";
                options.markup = renderToString(
                    <Provider store={store}>
                        <RouterContext {...props}/>
                    </Provider>
                );
            }
            res.render("index", options);
        });
    });
    return router;
}
