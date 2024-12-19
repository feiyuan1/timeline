import Koa = require('koa')
import Router = require('koa-router')
import types = require('../dataTypes')
import struct = require('./struct')
import routeMiddleware = require('./routeMiddleware')
import utils = require('../util')
import constants = require('../constants')

const { colName } = constants
const { isEveryEmpty } = utils
const { nodeStruct } = struct
const { responseMiddleware, collectionMiddleware } = routeMiddleware
const prefix = '/node'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const routeNode = (router: Router<any, Koa.BeContext<types.LineNodeD>>) => {
  router.use(prefix, collectionMiddleware<types.LineNodeD>(colName.node))

  router.put(prefix, async (ctx, next) => {
    const {
      request,
      db: { collection, dbName, client }
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

    const lineCol = client.db(dbName).collection<types.LineD>(colName.line)
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
