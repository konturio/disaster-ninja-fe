const webpack = require('webpack');
const resolve = require('path').resolve;
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

const { getEnv } = require('../utils');
const env = getEnv();

const plugins = [
  new NodePolyfillPlugin(),
  new CleanWebpackPlugin(),
  new webpack.DefinePlugin({
    ...Object.keys(env).reduce((acc, key) => {
      acc[`process.env.${key}`] =
        typeof env[key] !== 'object'
          ? `'${env[key]}'`
          : `'${JSON.stringify(env[key])}'`;
      return acc;
    }, {}),
    'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
  }),
  new HtmlWebPackPlugin({
    template: './src/index.ejs',
    filename: 'index.html',
    templateParameters: {
      NODE_ENV: process.env.NODE_ENV,
      ...env,
    },
  }),
  new MiniCssExtractPlugin({
    filename: '[name].css?[chunkhash]',
    chunkFilename: '[id].css?[chunkhash]',
  }),
  new WebpackPwaManifest({
    name: 'Disaster Ninja',
    icons: [
      { src: resolve('./src/favicon/192.png'), sizes: '192x192' },
      { src: resolve('./src/favicon/512.png'), sizes: '512x512' },
    ],
  }),
  new CopyWebpackPlugin([{ from: './public', to: './', force: true }]),
];

module.exports = plugins;
