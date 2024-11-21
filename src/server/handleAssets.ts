import { StatsCompilation, CustomWebpackState } from 'webpack'
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

// 内置了获取 external scripts 的逻辑
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

const getAssets = (state: Required<CustomWebpackState>) => {
  const { assetsByChunkName } = state.stats
  if (!assetsByChunkName) {
    throw 'assetsByChunkName is not defined'
  }
  const assets = composeAssets(assetsByChunkName)

  const scriptHtml = getScriptHtml(assets.scripts, state.stats)
  return { scriptHtml }
}

export default getAssets
