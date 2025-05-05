const path = require('path')
const { log } = require('./public/utils/log.js')

log(path.resolve(__dirname, 'src/constants'), __dirname)
