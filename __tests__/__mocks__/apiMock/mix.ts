import fetchMock from 'fetch-mock'
import { list } from '../lineList'

const prefix = '/api/mix'

export const mockGetAllList = () => {
  const response = { code: 0, data: list }
  fetchMock.get(`${prefix}/all`, response, {
    name: mockGetAllList.name
  })

  return { name: mockGetAllList.name, response }
}
