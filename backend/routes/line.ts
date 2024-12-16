import Koa = require('koa')
import Router = require('koa-router')
import types = require('../dataTypes')
const struct = require('./struct')
import routeMiddleware = require('./routeMiddleware')

const { lineStruct } = struct
const { responseMiddleware, collectionMiddleware } = routeMiddleware
const prefix = '/line'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const routeLine = (router: Router<any, Koa.BeContext<types.LineD>>) => {
  router.use(prefix, collectionMiddleware<types.LineD>('line'))

  // http://localhost:3000/api/line
  router.post('/line/:id', async (ctx, next) => {
    const {
      request,
      db: { collection }
    } = ctx
    const data = request.body as types.FormLine
    if (!Object.keys(data).length) {
      ctx.error = 'request body is empty, nothing to change'
      await next()
      return
    }
    await collection.updateOne(
      { id: ctx.params.id },
      { $set: { ...data, updateTime: Date.now() } }
    )
    await next()
  })

  router.put('/line', async (ctx, next) => {
    const {
      request,
      db: { collection }
    } = ctx
    const data = lineStruct(request.body as types.FormLine)
    await collection.insertOne(data)
    ctx.body = data
    await next()
  })

  router.get('/line', async (ctx, next) => {
    const {
      request,
      db: { collection }
    } = ctx
    const query = request.query || {}
    ctx.body = await collection.find<types.LineD>(query).toArray()
    await next()
  })

  router.delete('/line/:id', async (ctx, next) => {
    const {
      db: { collection },
      params: { id }
    } = ctx
    await collection.deleteOne({ id })
    await next()
  })

  router.use(prefix, responseMiddleware<types.LineD, types.Line>())
}

module.exports = routeLine
