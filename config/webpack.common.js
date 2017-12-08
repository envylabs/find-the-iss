const webpack = require('webpack');
const path = require('path');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const config = {
  context: path.resolve(__dirname, '..', 'src'),
  entry: {
    app: ['./app'],
    vendor: ['three'],
  },
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(jpe?g|png|svg|stl)$/i,
        use: 'file-loader',
      },
    ],
  },
  devServer: {
    contentBase: path.resolve(__dirname, '..', 'src'),
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
      title: 'Where’s the International Space Station?',
      appMountId: 'app-root',
    }),
    new FaviconsWebpackPlugin('./assets/favicon.png'),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['node_modules', path.resolve(__dirname, '..', 'src')],
  },
};

module.exports = config;
