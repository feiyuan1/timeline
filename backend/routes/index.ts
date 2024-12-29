import Router = require('koa-router')
const routeLine = require('./line')
const routeGroup = require('./lineGroup')
const routeMix = require('./mix')
const routeNode = require('./node')
const routeLog = require('./log')

const routes = (router: Router) => {
  routeLine(router)
  routeGroup(router)
  routeMix(router)
  routeNode(router)
  routeLog(router)
}
module.exports = routes
