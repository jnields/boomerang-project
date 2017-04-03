"use strict";
const proxyPort = require("./config").proxyPort,
    autoprefixer = require("autoprefixer"),
    webpack = require("webpack"),
    path = require("path");

module.exports =  {
    devtool: "cheap-module-eval-source-map",
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
            // worker-loader for items in worker directory
            {
                test: /\.jsx?$/,
                include: path.resolve(__dirname, "src", "client", "workers"),
                use: [
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
                                "transform-strict-mode",
                                "react-hot-loader/babel"
                            ]
                        }
                    }
                ]
            },
            // babel compiler for js files
            {
                test: /\.jsx?$/,
                include: path.resolve(__dirname, "src", "client"),
                exclude: [
                    path.resolve(__dirname, "node_modules"),
                    path.resolve(__dirname, "src", "client", "workers")
                ],
                use: {
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
            },
            // sass/css files
            {
                "test": /\.(s[ac]|c)ss$/,
                "use": [
                    "style-loader",
                    "css-loader"
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
                use: "json-loader"
            },
            // fonts
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?.*)?$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "[hash].[ext]",
                        emitFile: true
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
    "entry": [
        `webpack-dev-server/client?http://localhost:${proxyPort}`,
        "webpack/hot/only-dev-server",
        path.resolve(__dirname, "src", "client")
    ],
    node: {
        fs: "empty",
        Buffer: false
    },
    "output": {
        "path": path.resolve(__dirname, "public", "build"),
        "publicPath": `http://localhost:${proxyPort}/hot-reload-server/`,
        "filename": "bundle.js"
    },
    "plugins": [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [autoprefixer()]
            }
        })
    ]
};
