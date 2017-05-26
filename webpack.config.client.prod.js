const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const path = require('path');

if (process.env.NODE_ENV !== 'production') {
  console.log('Incorrect NODE_ENV!');
  process.exit(1);
}

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
        use: [
          {
            loader: 'eslint-loader',
            options: {
              failOnWarning: false,
              failOnError: true,
            },
          },
        ],
      },
      // worker-loader for items in worker directory
      {
        include: path.resolve(__dirname, 'src', 'client', 'workers'),
        use: [
          {
            loader: 'worker-loader',
            options: {
              inline: false,
            },
          },
          'babel-loader',
        ],
      },
      // null loader for server files
      {
        include: path.resolve(__dirname, 'src', 'server'),
        use: 'null-loader',
      },
      // babel compiler for js files
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, 'src', 'client'),
        exclude: path.resolve(__dirname, 'src', 'client', 'workers'),
        use: 'babel-loader',
      },
      // sass/css files - just get names, nothing else
      {
        test: /\.(s[ac]|c)ss$/,
        use: [
          {
            loader: 'css-loader/locals',
            options: {
              camelCase: true,
              modules: true,
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
      // fonts and images - do not emit files - server emits in css bundle
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|gif|jpeg|bmp)(\?.*)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[hash].[ext]',
              emitFile: false,
            },
          },
        ],
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
    path.resolve(__dirname, 'src', 'client'),
  ],
  node: {
    fs: 'empty',
    Buffer: false,
  },
  output: {
    path: path.resolve(__dirname, 'public', 'build'),
    publicPath: '/public/build/',
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        booleans: true,
        cascade: true,
        collapse_vars: true,
        conditionals: true,
        comparisons: true,
        dead_code: true,
        drop_console: true,
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
  ],
};
