import path from 'path';
import glob from 'glob';
import webpackNodeExternals from 'webpack-node-externals';

export default {
  module: {
    rules: [
      // babel compiler for js files
      {
        test: /\.jsx?$/,
        exclude: path.resolve('./node_modules'),
        use: 'babel-loader?forceEnv=server',
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
    {},
  ),
  target: 'node',
  externals: [webpackNodeExternals()],
  output: {
    filename: '[name]',
    path: path.resolve('./dist/scripts'),
  },
};
