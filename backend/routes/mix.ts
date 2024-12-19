import Koa = require('koa')
import Router = require('koa-router')
import types = require('../dataTypes')
import routeMiddleware = require('./routeMiddleware')
import struct = require('./struct')
import constants = require('../constants')

const { colName } = constants
const { groupStage, lineStage } = struct
const { responseMiddleware } = routeMiddleware
const prefix = '/mix'
type MixType = types.Line | types.LineGroup
type MixTypeD = types.LineD | types.LineGroupD

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const routeMix = (router: Router<any, Koa.BeContext<MixTypeD>>) => {
  router.get(`${prefix}/all`, async (ctx, next) => {
    const {
      db: { client, dbName }
    } = ctx
    const db = client.db(dbName)
    const lines = await db
      .collection<types.LineD>(colName.line)
      .aggregate<types.LineD>([
        { $match: { type: types.Type.line } },
        lineStage
      ])
      .toArray()
    const groups = await db
      .collection<types.LineGroupD>(colName.group)
      .aggregate<types.LineGroupD>([groupStage])
      .toArray()
    const result: (types.Line | types.LineGroup)[] = [].concat(groups, lines)
    ctx.body = result
    await next()
  })

  router.use(prefix, responseMiddleware<MixTypeD, MixType>())
}

module.exports = routeMix
