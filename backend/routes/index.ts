import Router = require('koa-router')
const routeLine = require('./line')
const routeGroup = require('./lineGroup')
const routeMix = require('./mix')
const routeNode = require('./node')

const routes = (router: Router) => {
  routeLine(router)
  routeGroup(router)
  routeMix(router)
  routeNode(router)
}
module.exports = routes
