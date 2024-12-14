const app = require('./app')

const port = process.env.PORT || 3001

app.listen(port, () => {
  console.info(`Node backend server running on port ${port}`) // eslint-disable-line
})
