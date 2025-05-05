import { lazy } from 'react'
import { RouteObject } from 'react-router'
import { Line, Log } from 'tools/types'

export * from 'tools/types'
export interface LogWithinNode extends Log {
  include?: boolean
}

export interface LineWithinGroup extends Line {
  include?: boolean
}

export type CustomRouteObject = RouteObject & {
  ComponentFactory?: Parameters<typeof lazy>[0]
}
