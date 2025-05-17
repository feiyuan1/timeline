const fs = require('fs')
const path = require('path')

const importJson = fs.readFileSync(path.resolve('./stats.json'))
const json = JSON.parse(importJson)
// 在 log 中不关注的 asset
const excludeAssets = [/\.html/, /runtime/]
const number2percent = (num, digits) => (num * 100).toFixed(digits) + '%'
const generateLog = () => {}

const keys = Object.keys(json)
// const uncachedChunks = {}

/**
 *
 * @param {{callback: function, result: any}} effects
 */
const mapAssetsWithEffects = (effects) => {
  return json.assets.reduce((results, asset) => {
    effects.forEach((effect, index) => {
      const { callback, result } = effect
      results[index] = callback(asset, results[index] || result)
    })

    return results
  }, [])
}

const generateEffect = (callback, result) => ({ callback, result })

const uncachedAssetsEffect = generateEffect(
  (asset, result) =>
    asset.cached === false && asset.emitted ? result.concat(asset) : result,
  []
)
const uncachedChunksEffect = generateEffect((asset, result) => {
  if (
    !asset.cached &&
    asset.emitted &&
    !excludeAssets.some((reg) => reg.test(asset.name))
  ) {
    const { chunks } = asset
    chunks.forEach((id) => {
      if (result[id]) {
        return
      }
      result[id] = true
    })
  }
  return result
}, {})

const allAssetsSizeEffect = generateEffect((asset, result) => {
  if (asset.emitted || asset.cached) {
    return result + asset.size
  }
  return result
}, 0)

const [uncachedAssets, uncachedChunks, allSize] = mapAssetsWithEffects([
  uncachedAssetsEffect,
  uncachedChunksEffect,
  allAssetsSizeEffect
])
// console.log(
//   'chunks: ',
//   json.chunks.map((chunk) => chunk.names)
// )
// console.log('chunks:', json.chunks)
// console.log('keys: ', keys)
// const uncachedAssets = json.assets.filter(
//   (asset) => asset.cached === false && asset.emitted
// )

const validUncachedAssets = uncachedAssets.filter(
  (asset) => !excludeAssets.some((reg) => reg.test(asset.name))
)

json.chunks.forEach((chunk) => {
  const { id, names, modules } = chunk
  if (id in uncachedChunks) {
    uncachedChunks[id] = {
      names,
      modules: modules.map((module) => module.name)
    }
  }
})

const uncachedModules = json.modules.filter((module) => module.cached === false)

// TODO 最后也把 构建时间，构建时长 也加上
const { builtAt, time } = json
console.log(new Date(builtAt).toLocaleString('zh-Hans-CN'), time / 1000 + 's')

// ---------- 要上报的指标
const assetUnhitRatio = number2percent(
  uncachedAssets.length / json.assets.length,
  2
)

const uncachedSize = uncachedAssets.reduce((size, asset) => {
  return size + asset.size
}, 0)

// console.log('keys', keys)
console.log(uncachedSize, allSize)
// console.log(
//   json.chunks.filter((chunk) => Object.keys(chunk.sizes).length > 1)
// )
console.log('uncached chunks: ', uncachedChunks)
// console.log(
//   json.assets.filter((asset) => asset.cached || asset.emitted).length
// )
console.log(
  'uncached assets: ',
  uncachedAssets.map((asset) => asset.name)
)
console.log(
  'valud uncached assets: ',
  validUncachedAssets.map((asset) => asset.name)
)
console.log('assets un hit ratio:', assetUnhitRatio)
console.log(uncachedModules.map((module) => module.name))
// console.log(json.modules.filter((module) => module.assets.length === 0))
