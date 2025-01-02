import Koa = require('koa')
import Router = require('koa-router')
import types = require('../dataTypes')
import struct = require('./struct')
import routeMiddleware = require('./routeMiddleware')
import utils = require('../util')
import constants = require('../constants')

const { colName } = constants
const { isEveryEmpty } = utils
const { initLog } = struct
const { responseMiddleware, collectionMiddleware } = routeMiddleware
const prefix = '/log'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const routeLog = (router: Router<any, Koa.BeContext<types.Log>>) => {
  router.use(prefix, collectionMiddleware<types.Log>(colName.log))

  router.get(prefix, async (ctx, next) => {
    const {
      query,
      db: { collection }
    } = ctx
    ctx.body = await collection.find(query).toArray()
    await next()
  })

  router.put(prefix, async (ctx, next) => {
    const {
      request,
      db: { collection, db }
    } = ctx
    const { nodeId, log } = request.body as {
      nodeId?: string
      log: types.FormLog
    }

    if (utils.isEmpty(request.body)) {
      ctx.error = types.Code.dataSourceError
      await next()
      return
    }

    if (utils.isEmpty(log)) {
      ctx.error = types.Code.requiredError
      await next()
      return
    }

    const nodeCol = db.collection<types.LineNodeD>(colName.node)
    const structedLog = initLog(log)
    const insert = collection.insertOne(structedLog)
    if (!nodeId) {
      await insert
      await next()
      return
    }
    const node = await nodeCol.findOne({ id: nodeId })
    const update = nodeCol.updateOne(
      { id: nodeId },
      {
        $set: { refs: node.refs.concat(structedLog.id) }
      }
    )
    await Promise.all([insert, update])
    await next()
  })

  router.post(`${prefix}/:id`, async (ctx, next) => {
    const {
      request,
      params: { id },
      db: { collection }
    } = ctx
    const log = request.body as types.Log
    if (utils.isEmpty(request.body)) {
      ctx.error = types.Code.dataSourceError
      await next()
      return
    }
    if (isEveryEmpty([log.name, log.content])) {
      ctx.error = types.Code.requiredError
      await next()
      return
    }
    collection.updateOne({ id }, { $set: struct.logStrcut(log) })
    await next()
  })

  router.use(prefix, responseMiddleware<types.Log, types.Log>())
}
module.exports = routeLog
