import customFetch from './customFetch'

const prefix = '/api/mix'

export const getAllList = () => {
  return customFetch(`${prefix}/all`).then((response) => {
    if (response.code === 0) {
      return response.data
    }
    return []
  })
}
