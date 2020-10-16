require('dotenv-flow').config()
const { login, getChannels } = require('./api')
const Chat = require('./chat')
const commands = require('./commands')

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
    if (message.startsWith("!")) {
      words = message.split(" ")
      command = words[0]
      userInput = words.slice(1).join(" ")
      if (commands.hasOwnProperty(command)) {
        out = commands[command](userInput)
        chat.sendMessage(channel, out)
      } else {
        // chat.sendMessage(channel, "Unrecognized command.")
      }
    }
  })
})

