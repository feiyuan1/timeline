import {
  createBrowserRouter,
  RouteObject,
  RouterProvider
} from 'react-router-dom'
import { getMultModule } from './utils/requireContext'

export const routes = getMultModule(
  require.context('./pages', true, /route.ts$/)
).reduce<RouteObject[]>((res, { default: r }) => res.concat(r), [])

// tip：在未开启 minimize 的情况下，应移入 AppRoutes 中
const router = /*#__PURE__*/ createBrowserRouter(routes)

export default function AppRoutes() {
  return <RouterProvider router={router} />
}
