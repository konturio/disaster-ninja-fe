const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

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
    favicon: './public/favicon.png',
    templateParameters: {
      NODE_ENV: process.env.NODE_ENV,
      ...env,
    },
  }),
  new MiniCssExtractPlugin({
    filename: '[name].css?[chunkhash]',
    chunkFilename: '[id].css?[chunkhash]',
  }),
  new CopyWebpackPlugin([{ from: './public', to: './', force: true }]),
];

module.exports = plugins;
