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

const customFetch = (url: RequestInfo | URL, config: Config) => {
  const { query, ...options } = config
  const resource = url + transformQuery(query)

  return fetch(resource, options)
    .then((response) => {
      if (!response.ok) {
        Alert.error(`request ${resource} failed with ${response.status}`)
      }
      return response.json()
    })
    .catch((err) => {
      Alert.error(`request ${resource} failed with ${err}`)
    })
}

export default customFetch
