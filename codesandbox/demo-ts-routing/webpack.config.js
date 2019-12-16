const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: './browser/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'browser', 'dist')
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({title: 'Hyperdom Demo'})
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader'
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          }
        ]
      }
    ]
  }
}
