"use strict";
const autoprefixer = require("autoprefixer"),
    webpack = require("webpack"),
    path = require("path");

module.exports =  {
    module: {
        "rules": [
            // enforce linting before build
            {
                enforce: "pre",
                test: /\.jsx?$/,
                include: path.resolve(__dirname, "src", "client"),
                exclude: path.resolve(__dirname, "node_modules"),
                use: [
                    {
                        loader: "eslint-loader",
                        options: {
                            failOnWarning: false,
                            failOnError: true
                        }
                    }
                ]
            },
            // worker-loader for items in worker directory
            {
                "include": path.resolve(__dirname, "src", "client", "workers"),
                "use": [
                    {
                        loader: "worker-loader",
                        options: {
                            inline: true
                        }
                    },
                    {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                "react",
                                "stage-1",
                                "es2015"
                            ],
                            plugins: [
                                "transform-runtime",
                                "transform-strict-mode"
                            ]
                        }
                    }
                ]
            },
            // babel compiler for js files
            {
                test: /\.jsx?$/,
                "include": path.resolve(__dirname, "src", "client"),
                "exclude": [
                    path.resolve(__dirname, "node_modules"),
                    path.resolve(__dirname, "src", "client", "workers")
                ],
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                "react",
                                "stage-1",
                                "es2015"
                            ],
                            plugins: [
                                "transform-runtime",
                                "transform-strict-mode",
                                "react-hot-loader/babel"
                            ]
                        }
                    }
                ]
            },
            // sass/css files - just get names, nothing else
            {
                "test": /\.(s[ac]|c)ss$/,
                "use": [
                    "css-loader/locals"
                        + "?modules"
                        + "&camelCase",
                    "postcss-loader",
                    "sass-loader"
                        + "?outputStyle=compressed"
                        + "&precision=8"
                ]
            },
            // json files
            {
                test: /\.json$/,
                use: ["json-loader"],
            },
            // fonts - do not emit files - server emits in css bundle
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?.*)?$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[hash].[ext]",
                            emitFile: false
                        }
                    }
                ]
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
    "entry": path.resolve(__dirname, "src", "client"),
    node: {
        fs: "empty",
        Buffer: false
    },
    "output": {
        "path": path.resolve(__dirname, "public", "build"),
        "publicPath": "/public/build/",
        "filename": "bundle.js"
    },
    "plugins": [
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("production")
            }
        }),
        new webpack.optimize.UglifyJsPlugin({compress:{warnings: false}}),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [autoprefixer()]
            }
        })
    ],
};
