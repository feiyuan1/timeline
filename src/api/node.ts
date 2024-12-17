import { FormNode } from 'types'
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
