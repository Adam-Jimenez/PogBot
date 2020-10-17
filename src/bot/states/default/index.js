const treeviz = require('../../commands/treeviz')
const { getPoints } = require('../../commands/points')

module.exports = class DefaultState {
  constructor(bot, chat, channels) {
    this.bot = bot
    this.chat = chat
    this.channels = channels
  }
  messageHandler({ channelSlug, message, user }) {
      if (message.startsWith("!")) {
        const words = message.split(" ")
        const command = words[0]
        const author = user.username
        const userInput = words.slice(1).join(" ")
        switch(command) {
          case "!echo":
            this.chat.sendMessage(channelSlug, userInput)
            break
          case "!treeviz":
            this.chat.sendMessage(channelSlug, treeviz(userInput))
            break
          case "!trivia":
            this.bot.setState("trivia")
            break
          case "!points":
            const points = getPoints(author)
            this.chat.sendMessage(channelSlug, `**${author}** has **${points}** points.`)
            break
          default:
            console.log(`Unrecognized command ${command}`)
        }
      }
  }
}
