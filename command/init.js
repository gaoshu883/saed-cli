const inquirer = require('inquirer')
const config = require('../templates')
const download = require('../lib/download.js')
const generator = require('../lib/generator.js')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

module.exports = (projectRoot) => {
  let gitUrl = config.tpl.url
  let branch = config.tpl.branch
  let target = path.join(projectRoot || '.', '.download-temp')
  let cmdStr = `git clone -b ${branch} ${gitUrl} ${target}`
  if (projectRoot !== '.') {
    if (fs.existsSync(projectRoot)) {
      return console.log(`${projectRoot}已存在`)
    } else {
      fs.mkdirSync(projectRoot)
    }
  }
  download(cmdStr)
    .then(() => {
      return Promise.resolve({
        name: projectRoot,
        root: projectRoot,
        downloadTemp: target
      })
    })
    /* 交互创建 */
    .then(context => {
      return new Promise((resolve, reject) => {
        inquirer.prompt([{
            name: 'projectName',
            message: '项目的名称',
            default: context.name
          }, {
            name: 'projectVersion',
            message: '项目的版本号',
            default: '1.0.0'
          }, {
            name: 'projectDescription',
            message: '项目的简介',
            default: `A project named ${context.name}`
          }, {
            name: 'projectAuthor',
            message: '项目作者',
            default: ''
          }])
          .then((answers) => {
            resolve({
              ...context,
              metadata: {
                ...answers
              }
            })
          })
          .catch((err) => {
            reject(err)
          })
      })
    })
    /* 模版替换 */
    .then(context => {
      let { metadata, root, downloadTemp} = context
      return generator(metadata, downloadTemp, root)
    })
    .then(context => {
      console.log(chalk.green('创建成功:)'))
      console.log(chalk.green('cd ' + context + '\nnpm install\nnpm run start'))
    })
    .catch((err) => {
      console.log(err)
      process.exit()
    })
}