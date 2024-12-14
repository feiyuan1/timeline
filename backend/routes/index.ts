import Router = require('koa-router')
const routeLine = require('./line')
const routeGroup = require('./lineGroup')

const routes = (router: Router) => {
  routeLine(router)
  routeGroup(router)
}
module.exports = routes
