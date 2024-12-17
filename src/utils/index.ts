import { Type } from '_constants/index'
import { Line, LineGroup } from 'types'

export const getLink = (data: Line | LineGroup) => {
  const { id, type } = data
  if (type === Type.lineGroup) {
    return '/line-group/' + id
  }
  if (type === Type.line) {
    return '/line/' + id
  }
  throw 'the type of item not be linegroup or line'
}
