import { Router } from "express";
import React from "react";
import { renderToString } from "react-dom/server";
import { match, RouterContext } from "react-router";
import routes from "../../client/routes";
import { Provider } from "react-redux";
import createStore from "../../client/helpers/create-store";
import api from "./api";
const env = process.env.NODE_ENV || "development";

module.exports = Promise.resolve(api).then(resolvedApi => {
    return {
        "/api": resolvedApi,
        "/": getPageRouter()
    };
});

function getPageRouter() {
    const router = Router();
    router.get("*", function(req, res) {
        match({ routes, location: req.url }, (err, redirect, props) => {
            if (err) {
                res.status(500).send(err.message);
            } else if (redirect) {
                res.redirect(redirect.pathname + redirect.search);
            } else if (!props) {
                res.status(404).send("Not Found");
            }
            const options = {
                title: "Express",
                lang: "en"
            };
            if (env === "development") {
                options.bundlePath = "/hot-reload-server/bundle.js";
                options.markup = "";
            } else {
                options.bundlePath = "/public/build/bundle.js";
                options.markup =
                    renderToString(
                        <Provider store={createStore()}>
                            <RouterContext {...props}/>
                        </Provider>
                    );
            }
            res.render("index", options);
        });
    });
    return router;
}
