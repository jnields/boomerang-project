import path from 'path';
import webpackNodeExternals from 'webpack-node-externals';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import BabelMinifyWebpackPlugin from 'babel-minify-webpack-plugin';

const prod = process.env.NODE_ENV === 'production';

export const styleChain = [
  `css-loader/locals?modules&camelCase${prod ? '' : '&localIdentName=[name]_[local]'}`,
  {
    loader: 'postcss-loader',
    options: {
      plugins: () => [autoprefixer()],
    },
  },
  'sass-loader?outputStyle=compressed&precision=8',
];


export default {
  devtool: prod ? 'sourcemap' : 'cheap-module-eval-source-map',
  entry: [
    'babel-polyfill',
    path.resolve('./src/server'),
  ],
  output: {
    path: path.resolve('./dist'),
    publicPath: '/public/',
    filename: 'server.js',
  },
  module: {
    rules: [
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
        exclude: path.resolve(__dirname, 'src', 'client', 'workers'),
        use: 'babel-loader?forceEnv=server',
      },
      // sass/css files - no server rendering in development
      {
        test: /\.(s[ac]|c)ss$/,
        use: styleChain,
      },
      // fonts and images - get path but do not emit file
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|gif|jpeg|bmp)(\?.*)?$/,
        use: 'file-loader?emitFile=false',
      },
    ],
  },
  resolve: {
    extensions: [
      '.js',
      '.jsx',
    ],
  },
  target: 'node',
  externals: prod ? undefined : [webpackNodeExternals()],
  plugins: [
    ...(
      prod
        ? [new BabelMinifyWebpackPlugin()]
        : []
    ),
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    new webpack.DefinePlugin({
      browser: 'false',
      server: 'true',
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
};
