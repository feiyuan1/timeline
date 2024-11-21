import { renderToString } from 'react-dom/server'
import { StaticRouterProvider } from 'react-router-dom/server'
import path from 'path'
import Koa from 'koa'
import getRouter from './getRouter'
import App from '../App'

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

async function serverRenderMiddleware(ctx: Koa.CustomContext, next: Koa.Next) {
  if (!goNext(ctx)) {
    // eslint-disable-next-line no-console
    console.log('serverRender')
    const { res, request, webpackState } = ctx
    const routerProps = await getRouter(request, res)
    const content = renderToString(
      <App>
        <StaticRouterProvider {...routerProps} />
      </App>
    )
    const fs = webpackState.outputFileSystem
    const { outputPath = '' } = webpackState.stats
    const filePath = path.resolve(outputPath, 'index.html')
    const htmlContent = fs.readFileSync(filePath, 'utf8')
    const html = insertContent(htmlContent, `<div id="root">${content}</div>`)
    ctx.body = html
  }
  await next()
}

export default serverRenderMiddleware
