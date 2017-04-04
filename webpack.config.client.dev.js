"use strict";
const proxyPort = process.env.PROXY_PORT || 35612,
    autoprefixer = require("autoprefixer"),
    webpack = require("webpack"),
    path = require("path");

module.exports =  {
    devtool: "cheap-module-eval-source-map",
    context: __dirname,
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
                                [
                                    "env",
                                    { modules: false }
                                ]
                            ],
                            plugins: [
                                "react-hot-loader/babel"
                            ]
                        }
                    }
                ]
            },
            // do not leak server code to client
            {
                include: path.resolve(__dirname, "src", "server"),
                use: "null-loader"
            },
            // babel compiler for js files
            {
                test: /\.jsx?$/,
                include: path.resolve(__dirname, "src", "client"),
                exclude: [
                    path.resolve(__dirname, "node_modules"),
                    // do not leak server code to client
                    path.resolve(__dirname, "src", "server"),
                    path.resolve(__dirname, "src", "client", "workers")
                ],
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "react",
                            "stage-1",
                            [
                                "env",
                                { modules: false }
                            ]
                        ],
                        plugins: [
                            "react-hot-loader/babel"
                        ]
                    }
                }
            },
            // sass/css files
            {
                "test": /\.(s[ac]|c)ss$/,
                "use": [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            camelCase: true
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: function() {
                                return [autoprefixer()];
                            }
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            outputStyle: "compressed",
                            precision: 8
                        }
                    }
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
        "webpack-dev-server/client?http://localhost:" + proxyPort,
        "webpack/hot/only-dev-server",
        path.resolve(__dirname, "src", "client")
    ],
    node: {
        fs: "empty",
        Buffer: false
    },
    "output": {
        "path": path.resolve(__dirname, "public", "build"),
        "publicPath": "http://localhost:" + proxyPort + "/hot-reload-server/",
        "filename": "bundle.js"
    },
    "plugins": [
        new webpack.HotModuleReplacementPlugin(),
    ]
};
