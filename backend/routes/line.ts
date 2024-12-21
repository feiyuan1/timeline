import Koa = require('koa')
import Router = require('koa-router')
import types = require('../dataTypes')
import struct = require('./struct')
import routeMiddleware = require('./routeMiddleware')
import constants = require('../constants')

const { colName } = constants
const { lineStruct } = struct
const { responseMiddleware, collectionMiddleware } = routeMiddleware
const prefix = '/line'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const routeLine = (router: Router<any, Koa.BeContext<types.LineD>>) => {
  router.use(prefix, collectionMiddleware<types.LineD>(colName.line))

  // http://localhost:3000/api/line
  router.post(`${prefix}/:id`, async (ctx, next) => {
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

  router.put(prefix, async (ctx, next) => {
    const {
      request,
      db: { collection }
    } = ctx
    const data = lineStruct(request.body as types.FormLine)
    await collection.insertOne(data)
    ctx.body = data
    await next()
  })

  router.get(prefix, async (ctx, next) => {
    const {
      request,
      db: { collection }
    } = ctx
    const query = struct.formatLine(request.query || {})
    ctx.body = await collection
      .aggregate<types.LineD>([{ $match: query }, struct.lineStage])
      .toArray()
    await next()
  })

  router.delete(`${prefix}/:id`, async (ctx, next) => {
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
