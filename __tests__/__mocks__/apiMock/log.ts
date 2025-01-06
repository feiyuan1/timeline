import fetchMock from 'fetch-mock'
import { logs } from '../lineList'

const prefix = '/api/log'

export const mockGetLog = () => {
  const response = { code: 0, data: logs }
  fetchMock.get(prefix, response, { name: mockGetLog.name })

  return { name: mockGetLog.name, response }
}
