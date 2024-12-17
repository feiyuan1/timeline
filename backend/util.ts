export * from './public/utils/log'

export const isEmpty = (data: unknown) => {
  if (typeof data === 'number') {
    return false
  }
  if (!data) {
    return true
  }
  if (Array.isArray(data)) {
    return !data.length
  }
  if (typeof data === 'object') {
    return !Object.keys(data).length
  }
  return false
}

export const isEveryEmpty = (list: unknown[]) => list.every(isEmpty)

export const isSomeEmpty = (list: unknown[]) => list.some(isEmpty)
