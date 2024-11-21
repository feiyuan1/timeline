import {
  createStaticHandler,
  createStaticRouter,
  StaticHandlerContext
} from 'react-router-dom/server'
import Koa from 'koa'
import { ServerResponse } from 'webpack-dev-middleware'
import { routes } from '../Router'

function createFetchRequest(req: Koa.Request, res: ServerResponse) {
  const origin = `${req.protocol}://${req.host}`
  const url = new URL(req.originalUrl || req.url, origin)

  const controller = new AbortController()
  res.on('close', () => controller.abort())

  const headers = new Headers()

  for (const [key, values] of Object.entries(req.headers)) {
    if (values) {
      if (Array.isArray(values)) {
        for (const value of values) {
          headers.append(key, value)
        }
      } else {
        headers.set(key, values)
      }
    }
  }

  const init: RequestInit = {
    method: req.method,
    headers,
    signal: controller.signal
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    // @ts-expect-error after use @types/koa-bodyparser, type of req.body is unknown
    init.body = req.body
  }

  return new Request(url.href, init)
}

const getRouter = async (req: Koa.Request, res: ServerResponse) => {
  // If we got a redirect response, short circuit and const our Express server
  // handle that directly
  // TODO not understand
  // if (context instanceof Response) {
  //   throw context
  // }

  const { query, dataRoutes } = createStaticHandler(routes)
  const fetchRequest = createFetchRequest(req, res)
  const context = (await query(fetchRequest)) as StaticHandlerContext
  const router = createStaticRouter(dataRoutes, context)
  return { router, context }
}

export default getRouter
