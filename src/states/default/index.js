const echo = require('../../commands/echo')
const treeviz = require('../../commands/treeviz')

module.exports = class DefaultState {
  constructor(bot, chat, channels) {
    this.bot = bot
    this.chat = chat
    this.channels = channels
    this.messageHandler = this.messageHandler.bind(this)
    this.commandHandlers = {
      "!echo": echo,
      "!treeviz": treeviz,
      "!trivia": () => this.bot.setState("trivia")
    }
  }
  messageHandler(payload) {
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
        if (this.commandHandlers.hasOwnProperty(command)) {
          const commandHandler = this.commandHandlers[command]
          const msg = commandHandler(userInput)
          if (msg) {
            this.chat.sendMessage(channel, msg)
          }
        } else {
          // chat.sendMessage(channel, "Unrecognized command.")
        }
      }
  }
}
