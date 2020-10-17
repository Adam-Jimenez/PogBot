const Chat = require('./chat')
const DefaultState = require('./states/default')

module.exports = class Bot {
  constructor(botUser, token, channels) {
    this.botUser = botUser
    this.token = token
    this.channels = channels
    this.chat = new Chat(botUser, token)
    this.chat.joinChannel(channels.random)
    this.setState(new DefaultState(this, this.chat))
  }
  setState(state) {
    if (this.state) {
      this.state.off()
    }
    this.state = state
    this.state.on()
  }
}
