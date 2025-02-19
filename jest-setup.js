require('@testing-library/jest-dom')
const fetchMock = require('fetch-mock').default
/**
 * polyfill for fetchMock
 */
require('whatwg-fetch')
const { ReadableStream } = require('web-streams-polyfill')

if (!globalThis.ReadableStream) {
  globalThis.ReadableStream = ReadableStream
}

fetchMock.mockGlobal()

fetchMock.config = Object.assign(fetchMock.config, {
  Request,
  Response,
  Headers,
  fetch
})

afterAll(() => {
  fetchMock.clearHistory()
  fetchMock.removeRoutes()
})

afterEach(() => {
  fetchMock.clearHistory()
})

module.exports = async function () {}
