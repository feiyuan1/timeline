import Koa = require('koa')
import Router = require('koa-router')
import types = require('../dataTypes')
import struct = require('./struct')
import routeMiddleware = require('./routeMiddleware')
import constants = require('../constants')
import util = require('../util')

const { isEmpty, formatLine } = util
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
    if (isEmpty(request.body)) {
      ctx.error = types.Code.dataSourceError
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
    const query = formatLine(request.query || {})
    ctx.body = await collection
      .aggregate<types.LineD>([{ $match: query }, struct.lineStage])
      .toArray()
    await next()
  })

  router.delete(`${prefix}/:id`, async (ctx, next) => {
    const {
      db: { collection, db },
      params: { id }
    } = ctx
    const { refs } = await collection.findOne({ id })
    const del = collection.deleteOne({ id })
    const nodeCol = db.collection<types.LineNodeD>(colName.node)
    const delNodes = refs.map((id) => nodeCol.deleteOne({ id }))
    await Promise.all(delNodes.concat(del))
    await next()
  })

  router.use(prefix, responseMiddleware<types.LineD, types.Line>())
}

module.exports = routeLine
