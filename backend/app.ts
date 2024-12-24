import Koa = require('koa')
import Router = require('koa-router')
import mongodb = require('mongodb')
const { bodyParser } = require('@koa/bodyparser')
const logger = require('./util')
const routes = require('./routes')

const { MongoClient, ServerApiVersion } = mongodb
const app = new Koa()
const router = new Router({ prefix: '/api' })

const dbMiddleware = async function (ctx: Koa.Context, next: Koa.Next) {
  // Connection URL
  const url =
    'mongodb+srv://balabala:qazwsx123*@timeline-db.yadvr.mongodb.net/?retryWrites=true&w=majority&appName=timeline-db'
  const dbName = 'timeline'
  const client = new MongoClient(url, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  })

  ctx.db = {
    dbName,
    client,
    db: client.db(dbName)
  }
  await next()
}

app.use(bodyParser())
app.use(dbMiddleware)

routes(router)

app.on('error', (err) => {
  logger.error(err)
})
app.use(router.routes()).use(router.allowedMethods())

module.exports = app
