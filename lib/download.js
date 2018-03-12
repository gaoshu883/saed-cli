const exec = require('child_process').exec
const ora = require('ora')
module.exports = (cmdStr) => {
  return new Promise((resolve, reject) => {
    const spinner = ora(`downloading the template...`).start()
    exec(cmdStr, (error, stdout, stderr) => {
      if (error) {
        spinner.fail()
        reject(error)
      }
      spinner.succeed()
      resolve()
    })
  })
}