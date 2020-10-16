require('dotenv-flow').config()
const { login, getChannels } = require('./api')
const Chat = require('./chat')

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
  chat = new Chat(user, token)
  chat.joinChannel(channels.random)
  chat.addMessageListener(payload => {
    channel = payload.channelSlug
    message = payload.message
    author = payload.user.username
    console.log(`${author}: ${message}`)
    if (author == username) {
      return
    }
    if (message.startsWith("!echo")) {
      msg_to_echo = message.split(" ").slice(1).join(" ")
      console.log(`[PogBot] echoing ${msg_to_echo}`)
      chat.sendMessage(channel, msg_to_echo)
    }
  })
})

