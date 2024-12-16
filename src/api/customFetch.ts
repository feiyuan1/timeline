import { ObjectWithString } from 'types'
import Alert from 'components/Alert'

interface Config extends RequestInit {
  query?: ObjectWithString
}

const transformQuery = (query: Config['query']) => {
  if (!query) {
    return ''
  }
  const searchParams = new URLSearchParams()
  for (const key in query) {
    searchParams.append(key, String(query[key]))
  }
  return `?${searchParams}`
}

const customFetch = (url: RequestInfo | URL, config?: Config) => {
  const { query, ...options } = config || {}
  const resource = url + transformQuery(query)

  return fetch(resource, options)
    .then((response) => {
      if (!response.ok) {
        throw response.status
      }
      return response.json()
    })
    .then((json) => {
      if (json.code === 0) {
        return json.data
      }
      throw json.msg
    })
    .catch((err) => {
      const errorInfo = `request ${resource} failed with ${err.message}`
      Alert.error(errorInfo)
      throw errorInfo
    })
}

export default customFetch
