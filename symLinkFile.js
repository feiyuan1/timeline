const { existsSync, symlinkSync } = require('fs')
const path = require('path')

const format = (paths, prefix) => {
  return paths.map((p) => ({
    source: p,
    target: path.join(prefix, p)
  }))
}

const publicPath = ['./public/utils', './public/types', './public/constants.ts']
const [utilPath, typePath, constPath] = publicPath
const backend = format(publicPath, './backend')
const client = format([typePath, constPath], './src')
const server = format([utilPath], './server')
const ends = [backend, client, server]

ends.forEach((end) => {
  end.forEach(({ source, target }) => {
    if (!existsSync(target)) {
      symlinkSync(path.resolve(source), target)
    }
  })
})
