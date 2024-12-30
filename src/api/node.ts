import { FormNode, LineNode, LogWithinNode } from 'types'
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

export const getNode = (query?: Partial<LineNode>): Promise<LineNode[]> => {
  return customFetch(prefix, { query })
}

export const deleteNode = (id: string) => {
  return customFetch(prefix, { method: 'delete', query: { id } })
}

export const getAggreateLogs = (id: string): Promise<LogWithinNode[]> =>
  customFetch(`${prefix}/agg-log/${id}`)

export const linkLogs = (nodeId: string, selectedLogs: string[]) => {
  return customFetch(`${prefix}/link-logs/${nodeId}`, {
    method: 'post',
    body: JSON.stringify({ selectedLogs }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
