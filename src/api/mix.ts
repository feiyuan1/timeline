import customFetch from './customFetch'

const prefix = '/api/mix'

export const getAllList = () => {
  return customFetch(`${prefix}/all`)
}
