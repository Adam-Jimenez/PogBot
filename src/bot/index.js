const Chat = require('../bsio/chat')
const DefaultState = require('./states/default')
const TriviaState = require('./states/trivia')

states = {
  "trivia": TriviaState,
  "default": DefaultState
}

module.exports = class Bot {
  constructor(botUser, token, channels) {
    this.botUser = botUser
    this.token = token
    this.channels = channels
    this.chat = new Chat(botUser, token, channels)
    this.setState("default")

    this.messageHandler = this.messageHandler.bind(this)

    this.chat.addMessageListener(this.messageHandler)

  }
  setState(nextState) {
    this.state = new states[nextState](this, this.chat, this.channels)
  }
  messageHandler(payload) {
    const { channelSlug , message, user } = payload
    const author = user.username
    console.log(`${author}: ${message}`)
    if (author == username) {
      return
    }

    this.state.messageHandler(payload)
  }
}
