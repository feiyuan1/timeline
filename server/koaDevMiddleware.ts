import webpack = require('webpack')
import Koa = require('koa')
import webpackDevMiddleware = require('webpack-dev-middleware')

function middleware(
  m: webpackDevMiddleware.API<
    webpackDevMiddleware.IncomingMessage,
    webpackDevMiddleware.ServerResponse
  >,
  req: webpackDevMiddleware.IncomingMessage,
  res: webpackDevMiddleware.ServerResponse
) {
  // @ts-expect-error generator with ts
  return (done) => {
    m(req, res, () => {
      done(null, 1)
    })
  }
}

const koaDevMiddleware = (
  compiler: webpack.Compiler,
  options: webpackDevMiddleware.Options
) => {
  const m = webpackDevMiddleware(compiler, options)
  // const t = async (ctx: Koa.Context, next: Koa.Next) => {
  //   const { req } = ctx
  //   const locals = ctx.locals || ctx.state

  //   const myNext = async function () {
  //     console.log('koa-dmw-ctx.body: ', customRes)
  //     await next()
  //     console.log(
  //       'koa-dmw-after body: ',
  //       // ctx.body.slice(0, 100)
  //       // ctx.response.body.slice(0, 100),
  //       ctx.response.status
  //     )
  //   }
  //   const customRes = {
  //     locals,
  //     setHeader: (name, value: any) => {
  //       ctx.set(name, value)
  //     }
  //   }

  //   await m(
  //     req,
  //     customRes,
  //     // next
  //     myNext
  //   )
  // }

  const t = function* (next: Koa.Next) {
    const ctx = this
    const { req, res: nodeRes } = ctx
    const locals = ctx.locals || ctx.state
    nodeRes.locals = locals
    // nodeRes.setHeader = function () {
    //   res.set.apply(res, arguments)
    // }
    // nodeRes.getHeader = function () {
    //   res.get.apply(res, arguments)
    // }
    // nodeRes.removeHeader = function () {
    //   res.remove.apply(res, arguments)
    // }
    // TODO 该写法和 nodeRes.on 区别
    // res.on = function () {
    //   nodeRes.on.apply(nodeRes, arguments)
    // }
    // res.once = function () {
    //   nodeRes.once.apply(nodeRes, arguments)
    // }
    // res.emit = function () {
    //   nodeRes.emit.apply(nodeRes, arguments)
    // }
    // res.removeListener = function () {
    //   nodeRes.removeListener.apply(nodeRes, arguments)
    // }
    // res.setHeader = function () {
    //   ctx.set.apply(ctx, arguments)
    // }
    // res.getHeader = function () {
    //   ctx.get.apply(ctx, arguments)
    // }
    // res.removeHeader = function () {
    //   ctx.remove.apply(ctx, arguments)
    // }
    // {
    //   locals,
    //   setHeader() {
    //     ctx.set.apply(ctx, arguments)
    //   },
    //   getHeader() {
    //     ctx.get.apply(ctx, arguments)
    //   },
    //   removeHeader() {
    //     ctx.remove.apply(ctx, arguments)
    //   }
    // }

    // @ts-expect-error generator with ts
    const runNext = yield middleware(m, req, nodeRes)

    if (runNext) {
      // @ts-expect-error generator with ts
      yield* next
    }
  }

  Object.keys(m).forEach(
    (
      p: keyof webpackDevMiddleware.API<
        webpackDevMiddleware.IncomingMessage,
        webpackDevMiddleware.ServerResponse
      >
    ) => {
      // @ts-expect-error generator with ts
      t[p] = m[p]
    }
  )

  return t
}
module.exports = koaDevMiddleware
