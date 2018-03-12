// https://juejin.im/post/5a31d210f265da431a43330e
const Metalsmith = require('metalsmith')
const Handlebars = require('handlebars')
const rm = require('rimraf').sync;
const path = require('path')
module.exports = (metadata = {}, src, dest = '.') => {
  if (!src) {
    return Promise.reject(new Error(`无效的source：${src}`))
  }
  return new Promise((resolve, reject) => {
    Metalsmith(process.cwd())
      .metadata(metadata)
      .clean(false)
      .source(src)
      .destination(dest)
      .use((files, metalsmith, done) => {
        const meta = metalsmith.metadata()
        Object.keys(files).some(fileName => {
          if (/^package\.json$/.test(fileName)) {
            const t = files[fileName].contents.toString()
            files[fileName].contents = new Buffer(Handlebars.compile(t)(meta))
            return true
          } else {
            return false
          }
        })
        done()
      }).build(err => {
        rm(src)
        rm(path.join(dest, '.git'))
        err ? reject(err) : resolve(dest)
      })
  })
}