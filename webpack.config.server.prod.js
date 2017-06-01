const autoprefixer = require("autoprefixer"),
    path = require("path"),
    webpack = require("webpack"),
    nodePath = path.resolve(path.join(__dirname, "node_modules")),
    nodePathLength = nodePath.length,
    ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports =  {
    module: {
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
                "loaders": [
                    "babel?"
                        + "presets[]=react"
                        + "&presets[]=stage-1"
                        + "&presets[]=es2015"
                        + "&plugins[]=transform-runtime"
                        + "&plugins[]=transform-strict-mode"
                ],
            },
            {
                "test": /\.(s[ac]|c)ss$/,
                "loader": ExtractTextPlugin.extract(
                    "css-loader"
                        + "?modules"
                        + "&camelCase"
                    + "!postcss-loader"
                    + "!sass-loader"
                        + "?outputStyle=compressed"
                        + "&precision=8"
                )
            },
            {
                test: /\.json$/,
                loader: "json",
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: "file"
                    + "?publicPath=/public/build/"
                    + "&outputPath=./public/build/"
                    + "&name=[hash].[ext]"
                    + "&emitFile=false"
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
    "entry": "./src/server",
    "eslint": {
        "failOnWarning": true,
        "failOnError": true
    },
    node: {
        __filename: false,
        __dirname: false
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
        "filename": "server-bundle.js",
        "libraryTarget": "commonjs"
    },
    "plugins": [
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("production")
            }
        }),
        new ExtractTextPlugin("public/build/bundle.css"),
    ],
    "stats": {

    }
};
