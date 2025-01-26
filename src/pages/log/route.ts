import { CustomRouteObject } from 'types'

const routes: CustomRouteObject[] = [
  {
    path: '/log/:id',
    ComponentFactory: () => import(/*webpackChunkName: 'log'*/ './Log')
  }
]

export default routes
