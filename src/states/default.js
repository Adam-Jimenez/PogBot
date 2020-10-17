const commands = require('../commands')

module.exports = class DefaultState {
  constructor(context, chat) {
    this.context = context
    this.chat = chat
    this.handler = this.handler.bind(this)
  }
  handler(payload) {
      let channel = payload.channelSlug
      let message = payload.message
      let author = payload.user.username
      console.log(`${author}: ${message}`)
      if (author == username) {
        return
      }
      if (message.startsWith("!")) {
        const words = message.split(" ")
        const command = words[0]
        const userInput = words.slice(1).join(" ")
        if (commands.hasOwnProperty(command)) {
          const msg = commands[command](userInput)
          this.chat.sendMessage(channel, msg)
        } else {
          // chat.sendMessage(channel, "Unrecognized command.")
        }
      }
  }
  on() {
    this.chat.addMessageListener(this.handler)
  }
  off() {
    this.chat.removeMessageListener(this.handler)
  }
}
