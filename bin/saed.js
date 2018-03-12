#!/usr/bin/env node --harmony

'use strict'
// 定义脚手架的文件路径
process.env.NODE_PATH = __dirname + '/../node_modules/'

const program = require('commander')
//
program
  .version(require('../package').version)
  .usage('<command> [项目名称]')
  .command('init')
  .description('Generate a new project')
  .alias('i')
  .parse(process.argv)
  .action(() => {
    let projectRoot = program.args[1]
    if (!projectRoot) {
      program.help()
    } else {
      projectRoot = program.args[1].args[1]
      require('../command/init')(projectRoot)
    }
  })

program.parse(process.argv)

if (!program.args.length) {
  program.help()
}