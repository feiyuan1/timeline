module.exports = {
  '__tests__/**/*.test.{ts,js,tsx}': (stagedFiles) =>
    `npm test ${stagedFiles.join(' ')}`,
  '!.husky/**/**': (stagedFiles) => `npx eslint --fix ${stagedFiles.join(' ')}`
}
