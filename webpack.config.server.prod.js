const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const nodePath = path.resolve(__dirname, 'node_modules');
const nodePathLength = nodePath.length;
const builtins = require('repl')._builtinLibs.reduce(
  (result, builtin) => Object.assign({}, result, { [builtin]: true }),
  {}
);

module.exports = {
  context: __dirname,
  module: {
    rules: [
      // enforce linting before build
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        include: path.resolve(__dirname, 'src', 'client'),
        exclude: path.resolve(__dirname, 'node_modules'),
        use: {
          loader: 'eslint-loader',
          options: {
            failOnWarning: false,
            failOnError: true,
          },
        },
      },
      // workers: do not load
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, 'src', 'client', 'workers'),
        use: 'null-loader',
      },
      // babel compiler for js files
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, 'src'),
        exclude: [
          path.resolve(__dirname, 'node_modules'),
          path.resolve(__dirname, 'src', 'client', 'workers'),
        ],
        use: 'babel-loader',
      },
      // sass/css files - extract text
      {
        test: /\.(s[ac]|c)ss$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                camelCase: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [autoprefixer()],
              },
            },
            {
              loader: 'sass-loader',
              options: {
                outputStyle: 'compressed',
                precision: 8,
              },
            },
          ],
        }),
      },
      // json files
      {
        test: /\.json$/,
        use: 'json-loader',
      },
      // fonts and images - emit file - client build does not resolve
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|gif|jpeg|bmp)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[hash].[ext]',
            emitFile: true,
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [
      '.js',
      '.jsx',
      '.sass',
      '.scss',
      '.css',
      '.json',
    ],
  },
  entry: [
    'babel-polyfill',
    path.resolve(__dirname, 'src', 'server'),
  ],
  node: {
    __filename: false,
    __dirname: false,
    process: false,
  },
  externals(context, request, cb) {
    let translatedRequest = request;
    let external = builtins[request]
      || /(^[^\/.]|(?:!))/.test(request);
    // starts with "/", "\", or "."; or contains "!"
    if (!external) {
      const fullPath = path.resolve(context, request);
      external = fullPath.substring(0, nodePathLength) === nodePath;
      if (external) {
        translatedRequest = fullPath.substring(nodePathLength + 1);
      }
    }
    if (external) {
      cb(null, `require(${JSON.stringify(translatedRequest)})`);
    } else {
      cb();
    }
  },
  output: {
    path: path.resolve(__dirname, 'public', 'build'),
    publicPath: '/public/build/',
    filename: '../../server.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'window': 'undefined',
      'browser': 'false',
      'server': 'true',
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        booleans: true,
        cascade: true,
        collapse_vars: true,
        conditionals: true,
        comparisons: true,
        dead_code: true,
        drop_console: false,
        drop_debugger: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
        loops: true,
        reduce_vars: true,
        sequences: true,
        unused: true,
        warnings: false,
      },
    }),
    new ExtractTextPlugin({
      filename: 'bundle.css',
      allChunks: true,
    }),
  ],
};
