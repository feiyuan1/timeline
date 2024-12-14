import { FormLine, Line } from 'types'
import customFetch from './customFetch'

const prefix = '/api/line'
export const updateLine = (id: Line['id'], line: FormLine & Partial<Line>) => {
  return customFetch(`${prefix}/${id}`, {
    method: 'post',
    body: JSON.stringify(line),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const addLine = (line: FormLine) => {
  return customFetch(prefix, {
    method: 'put',
    body: JSON.stringify(line),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const getLine = (query?: Partial<Line>) => {
  return customFetch(prefix, {
    query
  })
}

export const deleteLine = (id: Line['id']) => {
  return customFetch(`${prefix}/${id}`, {
    method: 'delete'
  })
}
