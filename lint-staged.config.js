module.exports = {
  '!.husky/**/**': (stagedFiles) => `npx eslint --fix ${stagedFiles.join(' ')}`
}
