import express from "express";
import path from "path";
import favicon from "serve-favicon";
import logger from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import routes from "./routes";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import proxy from "proxy-middleware";
import url from "url";
import devConfig from "../../webpack.config.client.dev";

const proxyPort = process.env.PROXY_PORT || 35612;

const app = express();
export default Promise.resolve(routes)
    .then(setupApp, err => {throw err;})
    .then(() => app, err => {throw err;});

function setupApp(resolvedRoutes) {
    app.use(compression());

    if (process.env.NODE_ENV !== "production") {
        app.use(
            "/hot-reload-server",
            proxy(url.parse(`http://localhost:${proxyPort}/hot-reload-server/`))
        );
        new WebpackDevServer(
            webpack(devConfig),
            {
                contentBase: __dirname,
                hot: true,
                quiet: false,
                noInfo: false,
                publicPath: "/hot-reload-server/",
                stats: "errors-only"
            }
        ).listen(proxyPort, "localhost");
    }

    // view engine setup
    app.set("views", path.resolve(__dirname, "src", "server", "views"));
    app.set("view engine", "pug");

    app.use(
        favicon(
            path.resolve(__dirname, "public", "favicon.ico")
        )
    );
    app.use(logger("dev"));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(
        "/public",
        express.static(
            path.resolve(__dirname, "public")
        )
    );

    Object.keys(resolvedRoutes).forEach(key => {
        app.use(key, resolvedRoutes[key]);
    });

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        let err = new Error("Not Found");
        err.status = 404;
        next(err);
    });

    // error handlers

    // development error handler
    // will print stacktrace
    if (app.get("env") === "development") {
        app.use(function(err, req, res) {
            res.status(err.status || 500);
            res.render("error", {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res) {
        res.status(err.status || 500);
        res.render("error", {
            message: err.message,
            error: {}
        });
    });
}
