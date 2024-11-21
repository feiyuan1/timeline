import {
  RouteObject,
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import { getMultModule } from './utils/requireContext'

export const routes: RouteObject[] = getMultModule(
  require.context('./pages', true, /route.ts$/)
).reduce<RouteObject[]>((res, { default: r }) => res.concat(r), [])

const Router = () => {
  const router = createBrowserRouter(routes)

  return <RouterProvider router={router} />
}
export default Router
