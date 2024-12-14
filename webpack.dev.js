const HtmlWebpackPlugin = require('html-webpack-plugin')
const { merge } = require('webpack-merge')
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const common = require('./webpack.common.js')
const { NODE_ENV } = require('./env.js')
const { scripts } = require('./scripts/devBuild.js')

module.exports = merge(common(NODE_ENV.DEV), {
  devtool: false,
  devServer: {
    historyApiFallback: true,
    hot: false,
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:3001'
      }
    ]
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
    }),
    new BundleAnalyzerPlugin({ openAnalyzer: false }) // http://127.0.0.1:8888/
  ]
})
