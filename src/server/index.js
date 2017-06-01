/**
 * Module dependencies.
 */

import appPromise from "./app";
import debug from "debug";
import http from "http";
import https from "https";
import config from "../../config";
import fs from "fs";
// import cluster from "cluster";
// import os from "os";

// const cpus = os.cpus().length;


Promise.resolve(appPromise).then(
    app => {
        // if(cluster.isMaster && app.get("env") === "production") {
        //     for (let i = 0; i < cpus; i++) {
        //         cluster.fork();
        //     }
        // } else {
        startServer(app);
        // }
    },
    err => {
        console.log(err);
        process.exit(1);
    }
);


function startServer(app) {
    const debugLog = debug("mern:server");
    /**
     * Get port from config and store in Express.
     */

    let port = normalizePort(config.port || "3000");
    app.set("port", port);

    /**
     * Create HTTP server.
     */

    let server;
    if (process.env.NODE_ENV === "production") {
        server = https.createServer(
            {
                cert: fs.readFileSync(config.certFile),
                key: fs.readFileSync(config.keyFile)
            },
            app
        );
    } else {
        server = http.createServer(app);
    }

    /**
     * Listen on provided port, on all network interfaces.
     */

    server.listen(port);
    server.on("error", onError);
    server.on("listening", onListening);

    /**
     * Normalize a port into a number, string, or false.
     */

    function normalizePort(val) {
        let intPort = parseInt(val, 10);
        if (isNaN(intPort)) {
            // named pipe
            return val;
        }
        if (intPort >= 0) {
            // port number
            return intPort;
        }
        return false;
    }

    /**
     * Event listener for HTTP(S) server "error" event.
     */

    function onError(error) {
        if (error.syscall !== "listen") {
            throw error;
        }

        let bind = typeof port === "string"
            ? "Pipe " + port
            : "Port " + port;

      // handle specific listen errors with friendly messages
        switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
        }
    }

    /**
     * Event listener for HTTP server "listening" event.
     */

    function onListening() {
        let addr = server.address();
        let bind = typeof addr === "string"
            ? "pipe " + addr
            : "port " + addr.port;
        debugLog("Listening on " + bind);
    }
}
