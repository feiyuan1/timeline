const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const { NODE_ENV } = require('./env.js')
const { scripts } = require('./scripts/build.js')

module.exports = merge(common(NODE_ENV.PROD), {
  devtool: 'hidden-source-map',
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename, path.resolve(__dirname, 'webpack.common.js')]
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'webpack 学习',
      chunks: ['index'],
      template: './public/index.html',
      inject: 'body',
      templateParameters: {
        scripts,
        test: 'testing'
      }
    })
  ]
})
