import Koa = require('koa')
import struct = require('./struct')

const { dataStruct } = struct

export const responseMiddleware = function <Coll, Content>() {
  return async function (ctx: Koa.BeContext<Coll>, next: Koa.Next) {
    const { response, error } = ctx
    // intentionally error for both of fe and be
    if (error) {
      response.set('Content-Type', 'application/json')
      response.body = JSON.stringify(struct.errorStruct(error))
      await next()
      return
    }
    const data = response.body as Content | undefined | string
    response.set('Content-Type', 'application/json')
    response.body = JSON.stringify(dataStruct<Content>(data && { data }))
    await next()
  }
}

export const collectionMiddleware = function <T>(colName: string) {
  return async (ctx: Koa.BeContext<T>, next: Koa.Next) => {
    const {
      db: { client, dbName }
    } = ctx
    const db = client.db(dbName)
    ctx.db.collection = db.collection<T>(colName)
    await next()
  }
}
