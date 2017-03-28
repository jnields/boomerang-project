"use strict";
const proxyPort = require("./config").proxyPort,
    autoprefixer = require("autoprefixer"),
    webpack = require("webpack"),
    path = require("path");

module.exports =  {
    devtool: "cheap-module-eval-source-map",
    module: {
        "noParse": [
            /node_modules\/xlsx\/jszip.js$/
        ],
        "preLoaders": [
            {
                test: /\.jsx?$/,
                loader: "eslint",
                exclude: /node_modules/
            }
        ],
        "loaders": [
            {
                "exclude": /node_modules/,
                "test": /\.jsx?$/,
                "loader": "babel",
                query: {
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
            },
            {
                "test": /\.s[ac]ss$/,
                "loaders": [
                    "css/locals"
                        + "?modules"
                        + "&camelCase",
                    "postcss",
                    "sass"
                        + "?outputStyle=compressed"
                        + "&precision=8"
                ]
            },
            {
                "test": /\.css$/,
                "loaders": [
                    "style",
                    "css"
                        + "?modules"
                        + "&camelCase",
                    "postcss"
                ]
            },
            {
                test: /\.json$/,
                loader: "json",
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?.*)?$/,
                loader: "file"
                    + "?publicPath=/public/build/"
                    + "&outputPath=./public/build/"
                    + "&name=[hash].[ext]"
                    + "&emitFile=true"
            }
        ]
    },
    resolve: {
        "root": path.join(__dirname, "node_modules"),
        "extensions": [
            "",
            ".js",
            ".jsx",
            ".sass",
            ".scss",
            ".css",
            ".json"
        ]
    },
    postcss: () => [autoprefixer],
    "entry": [
        `webpack-dev-server/client?http://localhost:${proxyPort}`,
        "webpack/hot/only-dev-server",
        "./src/client"
    ],
    "eslint": {
        "failOnWarning": false,
        "failOnError": true
    },
    node: {
        fs: "empty"
    },
    externals: {
        "./cptable": "var cptable"
    },
    "output": {
        "path": `${__dirname}/public/build`,
        "publicPath": `http://localhost:${proxyPort}/hot-reload-server/`,
        "filename": "bundle.js"
    },
    "plugins": [
        new webpack.HotModuleReplacementPlugin()
    ]
};
