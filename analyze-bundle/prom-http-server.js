const Koa = require('koa')
const Router = require('koa-router')
const client = require('prom-client')
const { bodyParser } = require('@koa/bodyparser')
const register = client.register
const router = new Router({ prefix: '/metrics' })

const counter = new client.Counter({
  name: 'bundle_size',
  help: 'total bundle size after build finished',
  labelNames: ['size']
})

router.get('/', async (ctx) => {
  ctx.body = await register.metrics()
})

router.post('/build-size', async ({ request, res }) => {
  counter.inc({ size: request.body.size })
  res.body = 'ok'
})

const app = new Koa()
app.use(bodyParser())
app.use(router.routes()).use(router.allowedMethods())

const port = process.env.PORT || 8090

app.listen(port, () => {
  console.info(`prom-client http server running on port ${port}`) // eslint-disable-line
})
