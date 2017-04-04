"use strict";
const autoprefixer = require("autoprefixer"),
    path = require("path"),
    nodePath = path.resolve(path.join(__dirname, "node_modules")),
    nodePathLength = nodePath.length,
    webpack = require("webpack"),
    ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports =  {
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
                            "react",
                            "stage-1",
                            [
                                "env",
                                { modules: false }
                            ]
                        ]
                    }
                }
            },
            // sass/css files - extract text
            {
                "test": /\.(s[ac]|c)ss$/,
                "use": ExtractTextPlugin.extract({
                    use: [
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
                                plugins: () => [autoprefixer()]
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
                })
            },
            // json files
            {
                test: /\.json$/,
                use: "json-loader"
            },
            // fonts - emit file - client build does not resolve
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
    "entry": path.resolve(__dirname, "src", "server"),
    node: {
        __filename: false,
        __dirname: false,
        process: false
    },
    externals: function(context, request, cb) {
        let external = !(/!/.test(request))
            && (/[^\.\/\\]/.test(request[0]));
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
            cb(null, request);
        } else {
            cb();
        }
    },
    "output": {
        path: path.resolve(__dirname, "public", "build"),
        publicPath: "/public/build/",
        filename: "../../server-bundle.js",
        libraryTarget: "commonjs"
    },
    "plugins": [
        // new webpack.optimize.UglifyJsPlugin({compress:{warnings: false}}),
        new ExtractTextPlugin({
            filename: "bundle.css",
            allChunks: true
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [autoprefixer()]
            }
        })
    ]
};
