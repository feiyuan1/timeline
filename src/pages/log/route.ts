import { RouteObject } from 'react-router-dom'
import Log from './Log'

const routes: RouteObject[] = [
  {
    path: '/log/:id',
    Component: Log
  }
]

export default routes
