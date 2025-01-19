const { spawn } = require('child_process')
// git diff --cached --numstat
const diff = spawn('git', ['diff', '--cached', '--numstat'])
const MAX_LINE = 300
const EXTREME_LINE = 600

diff.stdout.on('data', (data) => {
  const str = data.toString()
  const lineNums = str.match(/[0-9]+/g)
  const count = lineNums.reduce((result, cur) => {
    return result + Number(cur)
  }, 0)

  if (count >= EXTREME_LINE) {
    throw new Error(
      `the changed lines in staged files greater than ${EXTREME_LINE} lines!!!!!!WARNING!!`
    )
  }

  if (count >= MAX_LINE) {
    throw new Error(
      `the changed lines in staged files greater than ${MAX_LINE} lines, consider to split to multi PR`
    )
  }
})
