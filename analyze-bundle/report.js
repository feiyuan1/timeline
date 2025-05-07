const fs = require('fs')
const path = require('path')

const json = fs.readFileSync(path.resolve('./stats.json'))

console.log('type of json', typeof json)

try {
  console.log('keys length: ', Object.keys(JSON.parse(json)).length)
} catch (e) {
  console.log('erro: ', e)
}
