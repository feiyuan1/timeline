import fetchMock from 'fetch-mock'

const prefix = '/api/line'
export const mockAddLine = () => {
  fetchMock.put(prefix, { code: 0, data: 'OK' }, { name: mockAddLine.name })
  return { name: mockAddLine.name }
}
