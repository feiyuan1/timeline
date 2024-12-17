import { Type } from '_constants/index'
import { Line, LineGroup, LineNode } from 'types'

export const isLine = (type: Type) => [Type.line, Type.childLine].includes(type)

export const getLink = (data: Line | LineGroup | LineNode) => {
  const { id, type } = data
  if (type === Type.lineGroup) {
    return '/line-group/' + id
  }
  if (isLine(type)) {
    return '/line/' + id
  }
  if (type === Type.node) {
    return '/node/' + id
  }
  throw 'the type of item not be linegroup or line or node'
}
