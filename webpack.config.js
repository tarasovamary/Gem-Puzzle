const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    index: path.join(__dirname, './gem-puzzle/index.js'),
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './gem-puzzle/index.html'),
      filename: 'index.html',
      chunks: ['index'],
    }),
    new CopyPlugin({
      patterns: [
          {
              from: path.resolve(__dirname, './gem-puzzle/src'),
              to: path.resolve(__dirname, './dist/src'),
            },
      ],
    }),
  ],
  devServer: {
      watchFiles: path.join(__dirname, 'gem-puzzle'),
      port: 9000,
    },
  module: {
      rules: [
        {
          test: /\.(scss|css)$/,
          use: [
            'style-loader',
            'css-loader',
          ],
        },
        {
          test: /\.(woff2?|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
      ]
    },
    resolve: {
      extensions: ['.js'],
    },
};