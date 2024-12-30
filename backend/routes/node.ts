import Koa = require('koa')
import Router = require('koa-router')
import types = require('../dataTypes')
import struct = require('./struct')
import routeMiddleware = require('./routeMiddleware')
import utils = require('../util')
import constants = require('../constants')

const { colName } = constants
const { isEveryEmpty, formatNode } = utils
const { nodeStruct } = struct
const { responseMiddleware, collectionMiddleware } = routeMiddleware
const prefix = '/node'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const routeNode = (router: Router<any, Koa.BeContext<types.LineNodeD>>) => {
  router.use(prefix, collectionMiddleware<types.LineNodeD>(colName.node))

  router.get(prefix, async (ctx, next) => {
    const {
      query,
      db: { collection }
    } = ctx

    if (utils.isEmpty(query)) {
      ctx.error = types.Code.dataSourceError
      await next()
      return
    }

    ctx.body = await collection
      .aggregate([{ $match: formatNode(query) }, struct.nodeStage])
      .toArray()

    await next()
  })

  router.get(`${prefix}/agg-log/:id`, async (ctx, next) => {
    const {
      db: { collection, db },
      params: { id }
    } = ctx
    if (utils.isEmpty(id)) {
      ctx.error = types.Code.requiredError
      await next()
      return
    }
    const { refs } = await collection.findOne({ id })
    const logs = await db.collection(colName.log).find().toArray()
    ctx.body = logs.map((log) => {
      if (refs.includes(log.id)) {
        return { ...log, include: true }
      }
      return log
    })
    await next()
  })

  router.post(`${prefix}/link-logs/:id`, async (ctx, next) => {
    const {
      params: { id },
      db: { collection },
      request
    } = ctx
    const body = request.body as { selectedLogs: string[] }

    if (utils.isEmpty(body)) {
      ctx.error = types.Code.dataSourceError
      await next()
      return
    }
    if (!body.selectedLogs) {
      ctx.error = types.Code.requiredError
      await next()
      return
    }

    await collection.updateOne(
      { id },
      {
        $set: {
          refs: body.selectedLogs
        }
      }
    )
    await next()
  })

  router.delete(prefix, async (ctx, next) => {
    const {
      query,
      db: { collection }
    } = ctx

    if (utils.isEmpty(query)) {
      ctx.error = types.Code.dataSourceError
      await next()
      return
    }

    if (utils.isEmpty(query.id)) {
      ctx.error = types.Code.requiredError
      await next()
      return
    }

    await collection.deleteOne(query)
    await next()
  })

  router.put(prefix, async (ctx, next) => {
    const {
      request,
      db: { collection, db }
    } = ctx
    const { lineId, ...node } = request.body as types.FormNode & {
      lineId: string
    }

    if (isEveryEmpty([lineId, node])) {
      ctx.error = types.Code.dataSourceError
      await next()
      return
    }

    if (!lineId || !node.name) {
      ctx.error = types.Code.requiredError
      await next()
      return
    }

    const lineCol = db.collection<types.LineD>(colName.line)
    const structedNode = nodeStruct(node)
    const insert = collection.insertOne(structedNode)
    const line = await lineCol.findOne({ id: lineId })
    const update = lineCol.updateOne(
      { id: lineId },
      {
        $set: { refs: line.refs.concat(structedNode.id) }
      }
    )
    await Promise.all([insert, update])
    await next()
  })

  router.use(prefix, responseMiddleware<types.LineNodeD, types.LineNode>())
}
module.exports = routeNode
