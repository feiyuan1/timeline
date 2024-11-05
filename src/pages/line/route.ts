import { RouteObject } from 'react-router-dom'
import Line from './Line'
import LineGroup from './LineGroup'

const routes: RouteObject[] = [
  {
    path: '/line/:id',
    Component: Line
  },
  {
    path: '/line-group/:id',
    Component: LineGroup
  }
]

export default routes
