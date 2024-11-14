const HtmlWebpackPlugin = require('html-webpack-plugin')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const { NODE_ENV } = require('./env.js')
const { scripts } = require('./scripts/devBuild.js')

module.exports = merge(common(NODE_ENV.DEV), {
  devtool: false,
  devServer: {
    proxy: [
      {
        context: ['/'],
        target: 'http://localhost:3000'
      }
    ],
    devMiddleware: {
      serverSideRender: true,
      index: false
    },
    hot: false
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'dev-webpack 学习',
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
