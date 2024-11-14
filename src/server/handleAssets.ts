import { StatsCompilation } from 'webpack'
import {
  FilledContext,
  IncomingMessage,
  ServerResponse
} from 'webpack-dev-middleware'
import Koa from 'koa'
import { NODE_ENV } from '../../env'
import { scripts as proScripts } from '../../scripts/build'
import { scripts as devScripts } from '../../scripts/devBuild'

interface ComposedAssetsType {
  scripts: string[]
  styles: string[]
}

const isObject = (val: object) => {
  return val != null && val instanceof Object && !Array.isArray(val)
}

export const composeAssets = (chunks: Record<string, string[]>) => {
  const result: ComposedAssetsType = {
    scripts: [],
    styles: []
  }

  if (!isObject(chunks)) {
    return result
  }

  return Object.values(chunks).reduce((assets, chunk) => {
    chunk.forEach((asset) => {
      if (asset.endsWith('.css')) {
        assets.styles.push(asset)
        return
      }
      if (asset.endsWith('.js')) {
        assets.scripts.push(asset)
        return
      }
    })
    return assets
  }, result)
}

const getScriptHtml = (scripts: string[], stats: StatsCompilation) => {
  const { publicPath = '' } = stats
  const externalScripts =
    process.env.NODE_ENV === NODE_ENV.DEV ? devScripts : proScripts
  if (scripts.length) {
    return externalScripts
      .concat(scripts.map((path) => publicPath + path))
      .map((path) => `<script crossorigin src="${path}"></script>`)
      .join('\n')
  }
  return ''
}

const getAssets = (state: Koa.DefaultState) => {
  const { devMiddleware } = state.webpack as {
    devMiddleware: FilledContext<IncomingMessage, ServerResponse>
  }
  // @ts-expect-error TODO 整理 生产和 开发 提供资源的逻辑
  const jsonWebpackStats = devMiddleware.stats.toJson()
  const { assetsByChunkName } = jsonWebpackStats
  // @ts-expect-error TODO 整理 生产和 开发 提供资源的逻辑
  const assets = composeAssets(assetsByChunkName)

  const scriptHtml = getScriptHtml(assets.scripts, jsonWebpackStats)
  return { scriptHtml }
}

export default getAssets
