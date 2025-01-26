import { CustomRouteObject } from 'types'

const routes: CustomRouteObject[] = [
  {
    path: '/',
    ComponentFactory: () => import(/*webpackChunkName: 'main'*/ './Main')
  }
]

export default routes
