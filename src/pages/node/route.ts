import { RouteObject } from 'react-router-dom'
import Node from './Node'

const routes: RouteObject[] = [
  {
    path: '/node/:id',
    Component: Node
  }
]

export default routes
