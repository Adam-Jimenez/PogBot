require('dotenv-flow').config()
const { login, getChannels } = require('./bsio/api')
const Bot = require('./bot')

username = process.env.USERNAME
password = process.env.PASSWORD

let user = {}
let token = null

login(username, password).then(res => {
  token = res.token
  user = res.user
  return getChannels(user.id)
})
.then(channels => {
  bot = new Bot(user, token, channels)
})

