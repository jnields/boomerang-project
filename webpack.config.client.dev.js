const proxyPort = process.env.PROXY_PORT || 35612;
const port = process.env.PORT || 3000;
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const path = require('path');

if (process.env.NODE_ENV === 'production') {
  console.log('Incorrect NODE_ENV!');
  process.exit(1);
}

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  context: __dirname,
  module: {
    rules: [
      // lint and fix before build
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        include: path.resolve(__dirname, 'src', 'client'),
        exclude: path.resolve(__dirname, 'node_modules'),
        use: {
          loader: 'eslint-loader',
          options: {
            fix: true,
            failOnWarning: false,
            failOnError: false,
            emitError: false,
            emitWarning: false,
          },
        },
      },
      // worker-loader for items in worker directory
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, 'src', 'client', 'workers'),
        use: [
          {
            loader: 'worker-loader',
            options: {
              // must inline for dev-server. no workers allowed via CORS
              inline: true,
              fallback: false,
            },
          },
          'babel-loader',
        ],
      },
      // do not leak server code to client
      {
        include: path.resolve(__dirname, 'src', 'server'),
        use: 'null-loader',
      },
      // babel compiler for js files
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, 'src', 'client'),
        exclude: [
          path.resolve(__dirname, 'node_modules'),
          // do not leak server code to client
          path.resolve(__dirname, 'src', 'server'),
          path.resolve(__dirname, 'src', 'client', 'workers'),
        ],
        use: 'babel-loader',
      },
      // sass/css files
      {
        test: /\.(s[ac]|c)ss$/,
        use: [
          'style-loader',
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
      },
      // json files
      {
        test: /\.json$/,
        use: 'json-loader',
      },
      // fonts
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?.*)?$/,
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
    `webpack-dev-server/client?http://localhost:${proxyPort}`,
    'webpack/hot/only-dev-server',
    'babel-polyfill',
    path.resolve(__dirname, 'src', 'client', 'dev-server'),
  ],
  node: {
    fs: 'empty',
    Buffer: false,
  },
  output: {
    path: path.resolve(__dirname, 'public', 'build'),
    publicPath: `http://localhost:${proxyPort}/hot-reload-server/`,
    filename: 'bundle.js',
  },
  devServer: {
    hot: true,
    port: proxyPort,
    contentBase: path.resolve(__dirname, 'public', 'build'),
    publicPath: `http://localhost:${proxyPort}/hot-reload-server/`,
    headers: {
      'Access-Control-Allow-Origin': `http://localhost:${port}`,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
};
