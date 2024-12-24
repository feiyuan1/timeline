import Koa = require('koa')
import mongoDB = require('mongodb')
import types = require('./dataTypes')

declare module 'koa' {
  export interface BeContext<T = unknown> extends Koa.Context {
    db: {
      dbName: string
      client: mongoDB.MongoClient
      collection?: mongoDB.Collection<T>
      db: mongoDB.Db
    }
    error?: types.ErrorStructProps | types.Code | string
  }
}
