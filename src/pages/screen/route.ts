import { CustomRouteObject } from 'types'

const routes: CustomRouteObject[] = [
  {
    path: '/screen',
    ComponentFactory: () => import(/*webpackChunkName: 'screen'*/ './Screen')
  }
]

export default routes
