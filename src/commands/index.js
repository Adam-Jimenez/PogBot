const { readdirSync, statSync } = require('fs')
const { join } = require('path')

const dirs = readdirSync(__dirname).filter(f => statSync(join(__dirname, f)).isDirectory())
commands = {}
dirs.forEach(dir => {
  path = join(__dirname, dir)
  commands[`!${dir}`] = require(path)
})
module.exports = commands
