import { FormGroup, FormLine, LineGroup, LineWithinGroup } from 'types'
import customFetch from './customFetch'
import { getLine } from './line'
import { Type } from 'public/constants'

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

export const getAggregateLine = async (
  id: string
): Promise<LineWithinGroup[]> => {
  const line = getLine({ type: Type.line })
  const group = getGroup({ id }).then((group) => group[0].lines)
  return Promise.all([line, group]).then(([lines, includedLines]) => {
    return lines.concat(
      includedLines.map((item) => ({ ...item, include: true }))
    )
  })
}

export const linkList = (id: string, lines: string[]) => {
  return customFetch(`${prefix}/line/${id}`, {
    method: 'post',
    body: JSON.stringify({ lines }),
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
