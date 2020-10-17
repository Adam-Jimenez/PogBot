const io = require('socket.io-client');

ws_path = 'wss://chat.binarysearch.io/'

module.exports = class Chat {
  constructor(user, token, channels) {
    this.user   = user
    this.token  = token
    this.socket = io(ws_path);
    this.channels = channels.random
    this.joinChannel(channels.random)

    this.socket.on('connect', () => {
      console.log('Successfully connected!');
    });

    this.hooks = []
    this.socket.on('message', payload => {
      this.hooks.forEach(hook => {
        hook(payload)
      })
    })
    this.socket.on('error', err => {
      console.error(err)
    })
  }
  joinChannel(channel) {
    this.socket.emit('channel-join', channel)
  }
  addMessageListener(fn) {
    this.hooks.push(fn)
  }
  removeMessageListeners(fn) {
    this.hooks = []
  }
  sendMessage(channel, message) {
    this.socket.emit('message', this.token, channel, message)
  }
}
