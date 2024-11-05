import {
  createBrowserRouter,
  RouteObject,
  RouterProvider
} from 'react-router-dom'
import { getMultModule } from './utils/requireContext'

export default function AppRoutes() {
  const routes = getMultModule(require.context('./pages', true, /route.ts$/))
  const router = createBrowserRouter(
    routes.reduce<RouteObject[]>((res, { default: r }) => res.concat(r), [])
  )
  return <RouterProvider router={router} />
}
