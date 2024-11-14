import Koa = require('koa')
const serve = require('koa-static')
const Router = require('koa-router')
const path = require('path')
const webpack = require('webpack')
const { toTreeSync } = require('memfs/lib/print')
const clientConfig = require(path.resolve('./webpack.config.js'))({}, {})
const koaDevMiddleware = require('./koaDevMiddleware')
const { getSSRMiddleware } = require('./utils/sSRMiddleware')

// eslint-disable-next-line no-console
console.log('process.env.NODE_ENV: ', process.env.NODE_ENV)

const app = new Koa()
const serverRenderMiddleware = getSSRMiddleware()
const router = new Router()
const apiRouter = new Router({ prefix: '/api' })
// const middlewares = []

app.use(async (ctx: Koa.Context, next) => {
  // eslint-disable-next-line no-console
  console.log('request path: ', ctx.response.request.path)
  await next()
})

if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(clientConfig)
  app.use(
    koaDevMiddleware(compiler, {
      ...clientConfig.devServer.devMiddleware,
      publicPath: clientConfig.output.publicPath
    })
  )
  app.use(async (ctx: Koa.Context, next) => {
    const { devMiddleware } = ctx.state.webpack
    const outputFileSystem = devMiddleware.outputFileSystem
    const jsonWebpackStats = devMiddleware.stats.toJson()
    const { assetsByChunkName } = jsonWebpackStats
    // eslint-disable-next-line no-console
    console.log(
      'webpack finish: ',
      assetsByChunkName,
      toTreeSync(outputFileSystem)
    )
    await next()
  })
}
// TODO-server 区分路由（这样生产和开发环境在路由上的设计是相同的）
// TODO 整理 生产和 开发 提供资源的逻辑
app.use(serverRenderMiddleware)
app.use(apiRouter.routes()).use(apiRouter.allowedMethods())
app.use(router.routes()).use(router.allowedMethods())

if (process.env.NODE_ENV === 'production') {
  // app.use(express.static('dist'))
  app.use(serve(path.resolve('./dist')))
}

// app.use(middlewares)
module.exports = app
