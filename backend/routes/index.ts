const routeLine = require('./line')
import Router = require('koa-router')

const routes = (router: Router) => {
  routeLine(router)
}
module.exports = routes
