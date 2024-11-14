const app = require('./app')

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.info(`Node server running on port ${port}`) // eslint-disable-line
})
