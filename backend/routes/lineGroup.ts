import Koa = require('koa')
import Router = require('koa-router')
import types = require('../dataTypes')
import struct = require('./struct')
import routeMiddleware = require('./routeMiddleware')
import mongodb = require('mongodb')
import constants = require('../constants')
import utils = require('../util')

const { isEmpty, diffRefs } = utils
const { colName } = constants
const { groupStruct } = struct
const { responseMiddleware, collectionMiddleware } = routeMiddleware
const prefix = '/group'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const routeGroup = (router: Router<any, Koa.BeContext<types.LineGroupD>>) => {
  router.use(prefix, collectionMiddleware<types.LineGroupD>('lineGroup'))

  // http://localhost:3000/api/line
  router.post(`${prefix}/:id`, async (ctx, next) => {
    const {
      request,
      db: { collection }
    } = ctx
    const data = request.body as types.FormGroup
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
    const data = groupStruct(request.body as types.FormGroup)
    await collection.insertOne(data)
    ctx.body = data
    await next()
  })

  router.put(`${prefix}/line/:id`, async (ctx, next) => {
    const {
      request,
      db: { collection, db },
      params: { id }
    } = ctx
    const formLine = request.body as types.FormLine
    const line = struct.lineStruct({
      ...formLine,
      type: types.Type.childLine
    })
    await db.collection(colName.line).insertOne(line)
    const { refs } = await collection.findOne({ id })
    await collection.updateOne({ id }, { $set: { refs: refs.concat(line.id) } })
    ctx.body = line
    await next()
  })

  router.post(`${prefix}/line/:id`, async (ctx, next) => {
    const {
      request,
      db: { collection, db },
      params: { id }
    } = ctx
    const body = request.body as { lines: string[] }
    if (isEmpty(request.body)) {
      ctx.error = types.Code.dataSourceError
      await next()
      return
    }
    if (!body.lines) {
      ctx.error = types.Code.requiredError
      await next()
      return
    }
    const lineColl = db.collection(colName.line)
    const { refs } = await collection.findOne({ id })
    const [dels, adds] = diffRefs<string>(refs, body.lines)
    const addUpdates = adds.map((id) =>
      lineColl.updateOne({ id }, { $set: { type: types.Type.childLine } })
    )
    const delUpdates = dels.map((id) =>
      lineColl.updateOne({ id }, { $set: { type: types.Type.line } })
    )
    const update = collection.updateOne({ id }, { $set: { refs: body.lines } })
    await Promise.all(addUpdates.concat(update, delUpdates))
    await next()
  })

  router.get(prefix, async (ctx, next) => {
    const {
      request,
      db: { collection }
    } = ctx
    const query = request.query || {}
    ctx.body = await collection
      .aggregate([{ $match: query }, struct.groupStage])
      .toArray()

    await next()
  })

  router.delete(`${prefix}/:id`, async (ctx, next) => {
    const {
      db: { collection, db },
      params: { id },
      query
    } = ctx
    const { refs } = await collection.findOne({ id })
    const ref: {
      current: Promise<mongodb.UpdateResult | mongodb.DeleteResult>[]
    } = {
      current: []
    }
    const delGroup = collection.deleteOne({ id })
    if (refs.length) {
      const lineColl = db.collection<types.Line>(colName.line)
      if (Number(query.deleteLine)) {
        ref.current = refs.map((id) => lineColl.deleteOne({ id }))
      } else {
        ref.current = refs.map((id) =>
          lineColl.updateOne({ id }, { $set: { type: types.Type.line } })
        )
      }
    }
    await Promise.all(ref.current.concat(delGroup))
    await next()
  })

  router.use(prefix, responseMiddleware<types.LineGroupD, types.LineGroup>())
}

module.exports = routeGroup
