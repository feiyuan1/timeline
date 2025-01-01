import { FormLog, Log } from 'types'
import customFetch from './customFetch'

const prefix = '/api/log'
export const addLog = (nodeId: string, log: FormLog) => {
  return customFetch(prefix, {
    method: 'put',
    body: JSON.stringify({ nodeId, ...log }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const getLog = (query?: Partial<Log>): Promise<Log[]> => {
  return customFetch(prefix, { query })
}

export const updateLog = (id: string, data: Partial<Log>) => {
  return customFetch(`${prefix}/${id}`, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
