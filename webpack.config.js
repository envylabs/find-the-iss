const webpack = require('webpack');
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const config = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    app: './app.js',
    vendor: ['three'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/i,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(jpe?g|stl)$/i,
        use: 'file-loader',
      },
    ],
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'src'),
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),
    new webpack.ProvidePlugin({
      THREE: 'three',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime',
    }),
    new HTMLWebpackPlugin({
      inject: false,
      template: 'index.ejs',
      title: 'AR test',
    }),
  ],
};

module.exports = config;
