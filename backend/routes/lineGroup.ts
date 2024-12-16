import Koa = require('koa')
import Router = require('koa-router')
import types = require('../dataTypes')
import struct = require('./struct')
import routeMiddleware = require('./routeMiddleware')

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

  router.get(prefix, async (ctx, next) => {
    const {
      request,
      db: { collection }
    } = ctx
    const query = request.query || {}
    const cursor = await collection.find<types.LineGroup>(query)
    const data = await cursor.toArray()
    ctx.body = data
    await next()
  })

  router.delete(`${prefix}/:id`, async (ctx, next) => {
    const {
      db: { collection },
      params: { id },
      query
    } = ctx
    const { refs } = await collection.findOne({ id })
    if (refs.length) {
      if (query.deleteLine) {
        // delete line
      } else {
        // reset to line
      }
    }
    await collection.deleteOne({ id })
    await next()
  })

  router.use(prefix, responseMiddleware<types.LineGroupD, types.LineGroup>())
}

module.exports = routeGroup
