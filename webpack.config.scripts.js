const path = require('path');
const glob = require('glob');
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
        exclude: path.resolve(__dirname, 'node_modules'),
        use: {
          loader: 'eslint-loader',
          options: {
            failOnWarning: false,
            failOnError: true,
          },
        },
      },
      // babel compiler for js files
      {
        test: /\.jsx?$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        use: 'babel-loader',
      },
      // json files
      {
        test: /\.json$/,
        use: 'json-loader',
      },
    ],
  },
  resolve: {
    extensions: [
      '.js',
      '.jsx',
    ],
  },
  entry: glob.sync('./src/scripts/*').reduce(
    (result, file) => Object.assign(
      {},
      result,
      {
        [path.basename(file)]: [
          'babel-polyfill',
          file,
        ],
      }),
    {}
  ),
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
    filename: '[name]',
    path: path.resolve(__dirname, 'scripts'),
  },
};
