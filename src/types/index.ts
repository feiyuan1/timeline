import { Log } from 'public/types'

export * from 'public/types'
export interface LogWithinNode extends Log {
  include?: boolean
}
