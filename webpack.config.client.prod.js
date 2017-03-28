"use strict";
const autoprefixer = require("autoprefixer"),
    webpack = require("webpack"),
    path = require("path");

module.exports =  {
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
                        "transform-strict-mode"
                    ]
                }
            },
            {
                "test": /\.s[ac]ss?$/,
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
                    "css/locals"
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
    "entry": "./src/client",
    "eslint": {
        "failOnWarning": true,
        "failOnError": true
    },
    node: {
        fs: "empty"
    },
    externals: {
        "./cptable": "var cptable"
    },
    "output": {
        "path": path.join(__dirname, "public", "build"),
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
    ],
    "stats": {

    }
};
