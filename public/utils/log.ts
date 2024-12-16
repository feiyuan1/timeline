const PrettyError = require('pretty-error')
const pe = new PrettyError()

const error = (err: Error) => {
  // eslint-disable-next-line no-console
  console.log(pe.render(err))
}
module.exports = {
  // eslint-disable-next-line no-console
  log: console.log,
  error,
  mutiError: (errs: Error[]) => {
    errs.forEach(error)
  }
}

/**
 * TODO：ts 文件在其他子项目中引用时，由于没有正确编译导致执行异常，暂时改为 js 文件
 */
// const error = (err: Error) => {
//   // eslint-disable-next-line no-console
//   console.log(pe.render(err))
// }
// module.exports = {
//   // eslint-disable-next-line no-console
//   log: console.log,
//   error,
//   mutiError: (errs: Error[]) => {
//     errs.forEach(error)
//   }
// }
