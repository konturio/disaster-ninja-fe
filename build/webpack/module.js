const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const relativePath = require('../utils').relativePath;
const Autoprefixer = require('autoprefixer');
const PostcssNormalize = require('postcss-normalize');

module.exports = {
  rules: [
    {
      test: /\.tsx?$/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: { rootMode: 'upward' },
        },
      ],
    },
    {
      test: /\.html$/,
      use: [
        {
          loader: 'html-loader',
          options: { minimize: true },
        },
      ],
    },
    {
      test: /\.module\.p?css$/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
            modules: {
              localIdentName: '[name]_[local]__[hash:base64:5]',
            },
            importLoaders: 1,
          },
        },
        {
          loader: 'postcss-loader',
        },
      ],
    },
    {
      test: /\.p?css$/,
      resourceQuery: { not: [/raw/] },
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
            modules: false,
            importLoaders: 1,
          },
        },
        {
          loader: 'postcss-loader',
        },
      ],
      exclude: /\.module\./,
    },
    {
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    },
  ],
};
