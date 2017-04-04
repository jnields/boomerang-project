"use strict";
const path = require("path"),
    nodePath = path.resolve(__dirname, "node_modules"),
    nodePathLength = nodePath.length,
    builtins = require("repl")._builtinLibs.reduce(
        (result, builtin) => {
            result[builtin] = true;
            return result;
        },
        {}
    ),
    ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports =  {
    devtool: "source-map",
    context: __dirname,
    plugins: [
        new ExtractTextPlugin("public/build/bundle.css")
    ],
    module: {
        "rules": [
            // enforce linting before build
            {
                enforce: "pre",
                test: /\.jsx?$/,
                include: path.resolve(__dirname, "src", "client"),
                exclude: path.resolve(__dirname, "node_modules"),
                use: {
                    loader: "eslint-loader",
                    options: {
                        failOnWarning: false,
                        failOnError: true
                    }
                }
            },
            // workers: do not load
            {
                "test": /\.jsx?$/,
                "include": path.resolve(__dirname, "src", "client", "workers"),
                "use": "null-loader"
            },
            // babel compiler for js files
            {
                test: /\.jsx?$/,
                include: path.resolve(__dirname, "src"),
                exclude: [
                    path.resolve(__dirname, "node_modules"),
                    path.resolve(__dirname, "src", "client", "workers")
                ],
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            [
                                "env",
                                { modules: false }
                            ],
                            "react",
                            "stage-1"
                        ]
                    }
                }
            },
            // sass/css files - do not load
            {
                "test": /\.(s[ac]|c)ss$/,
                "use": "null-loader"
            },
            // json files
            {
                test: /\.json$/,
                use: "json-loader",
            },
            // fonts - get path but do not emit file
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?.*)?$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "[hash].[ext]",
                        emitFile: false
                    }
                }
            }
        ]
    },
    resolve: {
        "extensions": [
            ".js",
            ".jsx",
            ".sass",
            ".scss",
            ".css",
            ".json"
        ]
    },
    "entry": path.resolve(__dirname, "src", "server"),
    node: {
        __filename: false,
        __dirname: false,
        process: false
    },
    externals: function(context, request, cb) {
        let external = builtins[request]
            || /(^[^\\\/\.]|(?:\!))/.test(request); // starts with /\. or has !

        if (!external) {
            const fullPath = path.resolve(
                path.join(context,request)
            );
            external = fullPath.substring(0,nodePathLength) === nodePath;
            if (external) {
                request = fullPath.substring(nodePathLength + 1);
            }
        }
        if (external) {
            cb(null, "require(" + JSON.stringify(request) + ")");
        } else {
            cb();
        }
    },
    "output": {
        "filename": "server-bundle.js"
    }
};
