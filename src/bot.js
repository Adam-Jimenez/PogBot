const Chat = require('./chat')
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
  }
  setState(nextState) {
    if (this.state) {
      this.chat.removeMessageListeners()
    }
    this.state = new states[nextState](this, this.chat, this.channels)
    this.chat.addMessageListener(this.state.messageHandler)
  }
}
