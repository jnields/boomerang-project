const path = require('path');
const builtins = require('repl')._builtinLibs.reduce(
  (result, builtin) => Object.assign({}, result, { [builtin]: true }),
  {}
);

const nodePath = path.resolve(__dirname, 'node_modules');
const nodePathLength = nodePath.length;

module.exports = {
  context: __dirname,
  module: {
    rules: [
      // enforce linting before build
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        include: path.resolve(__dirname, 'src'),
        exclude: path.resolve(__dirname, 'node_modules'),
        use: {
          loader: 'eslint-loader',
          options: {
            fix: true,
            failOnWarning: false,
            failOnError: false,
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
      // sass/css files - do not load - no server rendering in development
      {
        test: /\.(s[ac]|c)ss$/,
        use: 'null-loader',
      },
      // json files
      {
        test: /\.json$/,
        use: 'json-loader',
      },
      // fonts and images - get path but do not emit file
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|gif|jpeg|bmp)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[hash].[ext]',
            emitFile: false,
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
    path.resolve(__dirname, 'src', 'server', 'dev-server'),
  ],
  node: {
    __filename: false,
    __dirname: false,
    process: false,
  },
  externals(context, request, cb) {
    let translatedRequest = request;
    let external = builtins[request]
      || /(^[^\\/.]|(?:!))/.test(request); // starts with /\. or has !

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
    filename: 'dev-server.js',
  },
};
