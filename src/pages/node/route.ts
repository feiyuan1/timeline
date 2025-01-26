import { CustomRouteObject } from 'types'

const routes: CustomRouteObject[] = [
  {
    path: '/node/:id',
    ComponentFactory: () => import(/*webpackChunkName: 'node'*/ './Node')
  }
]

export default routes
