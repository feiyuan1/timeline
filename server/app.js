const express = require('express')
const app = express()

console.log('process.env.NODE_ENV: ', process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
} else {
  app.use(express.static('dist'))
}

app.use((err, req, res) => {
  console.log('middle-error: ', err)
})

module.exports = app
