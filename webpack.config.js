/* Fallback to production mode */
if (process.env.NODE_ENV === undefined) process.env.NODE_ENV = 'production';

require('./build/utils').setRoot(__dirname);
const { relativePath } = require('./build/utils');

module.exports = {
  entry: {
    main: './src/index.tsx',
  },
  mode: process.env.NODE_ENV,
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
    path: relativePath('./dist'),
    publicPath: process.env.NODE_ENV === 'production'
      ? '/bivariate-manager/'
      : '/',
  },
  devtool: 'inline-source-map',
  resolve: require('./build/webpack/resolve'),
  devServer: require('./build/webpack/devServer'),
  plugins: require('./build/webpack/plugins'),
  module: require('./build/webpack/module'),
  optimization: require('./build/webpack/optimization'),
};
