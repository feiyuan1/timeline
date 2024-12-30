import { Line, Log } from 'public/types'

export * from 'public/types'
export interface LogWithinNode extends Log {
  include?: boolean
}

export interface LineWithinGroup extends Line {
  include?: boolean
}
