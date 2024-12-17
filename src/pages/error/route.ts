import { RouteObject } from 'react-router-dom'
import NoMatch from './404'

const routes: RouteObject[] = [
  {
    path: '*',
    Component: NoMatch
  }
]

export default routes
