import {
  RouteObject,
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import { getMultModule } from './utils/requireContext'
import { CustomRouteObject } from 'types'

export const routes: RouteObject[] = getMultModule<{
  default: CustomRouteObject[]
}>(require.context('./pages', true, /route.ts$/)).reduce<RouteObject[]>(
  (res, { default: routeModule }) =>
    res.concat(
      routeModule.map((route) => {
        const ComponentFactory = route.ComponentFactory
        if (!ComponentFactory) {
          return route
        }

        delete route['ComponentFactory']
        return {
          ...route,
          lazy: () =>
            ComponentFactory().then((routeComponent) => ({
              Component: routeComponent.default
            }))
        }
      })
    ),
  []
)

const Router = () => {
  const router = createBrowserRouter(routes)

  return <RouterProvider router={router} />
}
export default Router
