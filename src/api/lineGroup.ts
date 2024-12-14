import { FormGroup, LineGroup } from 'types'
import customFetch from './customFetch'

const prefix = '/api/group'
export const getGroup = (query?: Partial<LineGroup>) => {
  return customFetch(prefix, {
    query
  })
}

export const addGroup = (lineGroup: FormGroup) => {
  return customFetch(prefix, {
    method: 'put',
    body: JSON.stringify(lineGroup),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const updateGroup = (id: LineGroup['id'], lineGroup: FormGroup) => {
  return customFetch(`${prefix}/${id}`, {
    method: 'post',
    body: JSON.stringify(lineGroup),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const deleteGroup = (
  id: LineGroup['id'],
  deleteLine: boolean = false
) => {
  return customFetch(`${prefix}/${id}`, {
    method: 'delete',
    query: { deleteLine }
  })
}
