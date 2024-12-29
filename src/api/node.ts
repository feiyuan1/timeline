import { FormNode, LineNode } from 'types'
import customFetch from './customFetch'

const prefix = '/api/node'
export const addNode = (lineId: string, node: FormNode) => {
  return customFetch(prefix, {
    method: 'put',
    body: JSON.stringify({ lineId, ...node }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const getNode = (query?: Partial<LineNode>) => {
  return customFetch(prefix, { query })
}

export const deleteNode = (id: string) => {
  return customFetch(prefix, { method: 'delete', query: { id } })
}
