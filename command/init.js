'use strict'
const exec = require('child_process').exec
const co = require('co')
const prompt = require('co-prompt')
const config = require('../templates')
const chalk = require('chalk')

module.exports = () => {
  co(function* () {
    let projectName = yield prompt('Project name: ')
    let gitUrl = config.tpl.url
    let branch = config.tpl.branch
    let cmdStr = `git clone -b ${branch} ${gitUrl} ${projectName}`

    console.log(chalk.white('\n Start generating...'))

    exec(cmdStr, (error, stdout, stderr) => {
      if (error) {
        console.log(error)
        process.exit()
      }
      console.log(chalk.green('\n √ Generation completed!'))
      console.log(`\n cd ${projectName} && npm install \n`)
      process.exit()
    })
  })
}