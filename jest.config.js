/** @type {import('ts-jest').JestConfigWithTsJest} **/

module.exports = {
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: ['node'],
    url: 'http://locahost:3000'
  },
  transform: {
    '^.+.(tsx|ts)?$': ['ts-jest', {}]
  },
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
  // moduleDirectories: [
  // 'node_modules'
  //   __dirname // the root directory
  // ],
  // handle assets
  moduleNameMapper: {
    '^components(.*)$': '<rootDir>/src/components$1',
    '^pages(.*)$': '<rootDir>/src/pages$1',
    '^assets(.*)$': '<rootDir>/src/assets$1',
    '^utils(.*)$': '<rootDir>/src/utils$1',
    '^types(.*)$': '<rootDir>/src/types$1',
    '^_constants(.*)$': '<rootDir>/src/constants$1',
    '^public(.*)$': '<rootDir>/src/public$1',
    '^api(.*)$': '<rootDir>/src/api$1',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__tests__/__mocks__/fileMock.js',
    '\\.(css|less)$': '<rootDir>/__tests__/__mocks__/styleMock.js'
  },
  testMatch: ['**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)']
}
