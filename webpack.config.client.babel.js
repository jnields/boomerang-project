import autoprefixer from 'autoprefixer';
import webpack from 'webpack';
import path from 'path';
import BabelMinifyWebpackPlugin from 'babel-minify-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const proxyPort = process.env.PROXY_PORT;
const port = process.env.PORT;

const prod = process.env.NODE_ENV === 'production';

export const styleChain = [
  `css-loader?modules&camelCase${prod ? '' : '&localIdentName=[name]_[local]'}`,
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
    ...(prod
        ? []
        : [
          `webpack-dev-server/client?http://localhost:${proxyPort}`,
          'webpack/hot/only-dev-server',
        ]
      ),
    'babel-polyfill',
    path.resolve('./src/client'),
  ],
  output: {
    path: path.resolve('./dist/public'),
    publicPath: `http://localhost:${proxyPort}/hot-reload-server/`,
    filename: 'bundle.js',
  },
  module: {
    rules: [
      // worker-loader for items in worker directory
      {
        test: /\.jsx?$/,
        include: path.resolve('./src/client/workers'),
        use: [
          {
            loader: 'worker-loader',
            options: {
              // must inline for dev-server. no workers allowed via CORS
              inline: !prod,
              fallback: false,
            },
          },
          'babel-loader?forceEnv=client',
        ],
      },
      // do not leak server code to client
      {
        include: path.resolve('./src/server'),
        use: 'null-loader',
      },
      // babel compiler for js files
      {
        test: /\.jsx?$/,
        include: path.resolve('./src/client'),
        exclude: path.resolve('./src/client/workers'),
        use: 'babel-loader',
      },
      // sass/css files
      {
        test: /\.(s[ac]|c)ss$/,
        use: prod
          ? ExtractTextPlugin.extract({ use: styleChain })
          : [
            'style-loader',
            ...styleChain,
          ],
      },
      // fonts and images
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|gif|jpeg|bmp)(\?.*)?$/,
        use: 'file-loader?emitFile=true',
      },
    ],
  },
  resolve: {
    extensions: [
      '.js',
      '.jsx',
    ],
  },
  devServer: {
    hot: true,
    port: proxyPort,
    contentBase: path.resolve('./dist/public'),
    publicPath: `http://localhost:${proxyPort}/hot-reload-server/`,
    headers: {
      'Access-Control-Allow-Origin': `http://localhost:${port}`,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  },
  plugins: [
    ...(prod
      ? [
        new BabelMinifyWebpackPlugin(),
        new ExtractTextPlugin({
          filename: 'bundle.css',
          allChunks: true,
        }),
      ]
      : [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
      ]
    ),
    new webpack.DefinePlugin({
      browser: 'true',
      server: 'false',
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
};
