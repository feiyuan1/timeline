import { CustomRouteObject } from 'types'

const routes: CustomRouteObject[] = [
  {
    path: '/line/:id',
    ComponentFactory: () => import(/*webpackChunkName: 'line'*/ './Line')
  },
  {
    path: '/line-group/:id',
    ComponentFactory: () =>
      import(/*webpackChunkName: 'line_group'*/ './LineGroup')
  }
]

export default routes
