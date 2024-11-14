import { renderToString } from 'react-dom/server'
import path from 'path'
import fs from 'fs'
import Koa from 'koa'
import getRouter from './handleReactRoute'
import getAssets from './handleAssets'

/**
 * serverRenderMiddleware 处理路由规则：
 * - 跳过以下路由：
 *  1. /api
 *  2. 包含 . 的路由（表示这是一个静态资源）
 */
const goNext = (ctx: Koa.Context) => {
  const path = ctx.request.path
  if (path.match(/^\/api.*/)) {
    return true
  }
  if (path.match(/\./)) {
    return true
  }
  return false
}

const insertContent = (html: string, content: string) =>
  html.replace('<div id="root"></div>', content)

async function serverRenderMiddleware(ctx: Koa.Context, next: Koa.Next) {
  if (!goNext(ctx)) {
    // eslint-disable-next-line no-console
    console.log('serverRender')
    const { res, request, state } = ctx
    const route = renderToString(await getRouter(request, res))
    const filePath = path.resolve('./public', 'index.html')
    const htmlContent = fs.readFileSync(filePath, 'utf8')
    const { scriptHtml } = getAssets(state)
    // TODO insert styles
    const html = insertContent(
      htmlContent,
      `<div id="root">${route}</div>` + scriptHtml
    )
    ctx.body = html
  }
  await next()
}

export default serverRenderMiddleware
