import { FormGroup, FormLine, LineGroup } from 'types'
import customFetch from './customFetch'

const prefix = '/api/group'
export const getGroup = (query?: Partial<LineGroup>): Promise<LineGroup[]> => {
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

export const addChildLine = (id: string, line: FormLine) => {
  return customFetch(`${prefix}/line/${id}`, {
    method: 'put',
    body: JSON.stringify(line),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const linkList = (id: string, lines: string[]) => {
  return customFetch(`${prefix}/line/${id}`, {
    method: 'post',
    body: JSON.stringify(lines),
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
    query: { deleteLine: Number(deleteLine) }
  })
}
