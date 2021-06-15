const webpack = require("webpack");
const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const WebpackBarPlugin = require("webpackbar");
const CopyWebpackPlugin = require('copy-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('@nuxt/friendly-errors-webpack-plugin');
module.exports = {
  mode: "development",
  entry: "./client/src/main.js",
  output: {
    path: path.resolve(process.cwd(),'server/static'),
    filename: 'js/[name].js'
  },
  resolve: {
    extensions: [".vue", ".js", ".jsx", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          'url-loader',
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ]
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: "dev/template/index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'client/public' }
      ]
    }),
    new FriendlyErrorsWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new WebpackBarPlugin({
      name: "10pdf-render-website",
    }),
  ],
};
