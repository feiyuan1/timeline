const HtmlWebpackPlugin = require('html-webpack-plugin')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const { NODE_ENV } = require('./env.js')
const { scripts } = require('./scripts/build.js')

module.exports = merge(common(NODE_ENV.DEV), {
  devtool: false,
  devServer: {
    // proxy: {
    //   '/api': { target: 'http://localhost:3000', pathRewrite: { '^/api': '' } },
    //   '/baidu': {
    //     target: 'https://www.baidu.com',
    //     pathRewrite: { '^/baidu': '' }
    //   }
    // }
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
