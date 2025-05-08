const { mkdirSync, symlinkSync, rmSync } = require('fs')
const path = require('path')

const format = (paths, prefix) => {
  return paths.map((p) => ({
    source: p,
    target: path.join(prefix, p)
  }))
}

const publicPrefix = './public'
const targets = ['backend', 'src', 'server']
const publicPath = ['./public/utils', './public/types', './public/constants.ts']
const [utilPath, typePath, constPath] = publicPath
const backend = format(publicPath, targets[0])
const client = format([typePath, constPath, utilPath], targets[1])
const server = format([utilPath], targets[2])
const ends = [backend, client, server]

targets.forEach((target) => {
  const targetDir = path.join('./', target, publicPrefix)
  rmSync(targetDir, { recursive: true, force: true })
  mkdirSync(targetDir)
})

ends.forEach((end) => {
  end.forEach(({ source, target }) => {
    symlinkSync(path.resolve(source), target)
  })
})
