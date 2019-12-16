const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: './browser/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'browser', 'dist')
  },
  resolve: {
    extensions: ['.js']
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({title: 'Hyperdom Demo'})
  ]
}
