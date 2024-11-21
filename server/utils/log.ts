const PrettyError = require('pretty-error')
const pe = new PrettyError()

const error = (err: Error) => {
  // eslint-disable-next-line no-console
  console.log(pe.render(err))
}
module.exports = {
  error,
  mutiError: (errs: Error[]) => {
    errs.forEach(error)
  }
}
