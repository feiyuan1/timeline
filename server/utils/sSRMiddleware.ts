const path = require('path')
const serveConfig = require(path.resolve('./webpack.server.js'))
const {
  output: { filename, path: outputPath, library }
} = serveConfig

export const getSSRMiddleware = () => {
  return require(path.join(outputPath, filename))[library.name].default
}
