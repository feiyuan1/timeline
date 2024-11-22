/**
 * 废弃的 dev 环境下 server 端代码
const { toTreeSync } = require('memfs/lib/print')
const koaDevMiddleware = require('./koaDevMiddleware')

const compiler = webpack(clientConfig)
app.use(
  koaDevMiddleware(compiler, {
    ...clientConfig.devServer.devMiddleware,
    publicPath: clientConfig.output.publicPath
  })
)

app.use(async (ctx, next) => {
  console.log('comein')
  let myNext
  const m = require('webpack-hot-middleware')(compiler, {
    reload: true
  })
  const p = new Promise((resolve) => {
    myNext = function () {
      resolve(next.bind(this, ...arguments))
    }
  })
  await m(ctx.req, ctx.res, myNext)
  const res = await p
  await res()
  // const m = require('webpack-hot-middleware')(compiler)
  // await m(ctx.req, ctx.res, next)
})

app.use(async (ctx: Koa.Context, next) => {
  const { devMiddleware } = ctx.state.webpack
  const outputFileSystem = devMiddleware.outputFileSystem
  const jsonWebpackStats = devMiddleware.stats.toJson('normal')
  webpackState.stats = jsonWebpackStats
  const { assetsByChunkName } = jsonWebpackStats
  // eslint-disable-next-line no-console
  console.log(
    'webpack finish: ',
    assetsByChunkName,
    toTreeSync(outputFileSystem)
  )
  await next()
})

 */
