import Koa = require('koa')
import { Collection, MongoClient } from 'mongodb'

declare module 'koa' {
  export interface BeContext<T = unknown> extends Koa.Context {
    db: {
      dbName: string
      client: MongoClient
      collection?: Collection<T>
    }
    error?: string
  }
}
