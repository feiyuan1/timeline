import Koa = require('koa')
import struct = require('./struct')

const { dataStruct } = struct

export const responseMiddleware = function <T>() {
  return async function (ctx: Koa.BeContext<T>, next: Koa.Next) {
    const { response, error } = ctx
    // intentionally error for both of fe and be
    if (error) {
      response.set('Content-Type', 'application/json')
      response.body = JSON.stringify(struct.errorStruct({ msg: error }))
      await next()
      return
    }
    const data = response.body as T | undefined | string
    response.set('Content-Type', 'application/json')
    response.body = JSON.stringify(dataStruct<T>(data && { data }))
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
