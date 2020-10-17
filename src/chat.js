const io = require('socket.io-client');

ws_path = 'wss://chat.binarysearch.io/'

module.exports = class Chat {
  constructor(user, token) {
    this.user   = user
    this.token  = token
    this.socket = io(ws_path);

    this.socket.on('connect', () => {
      console.log('Successfully connected!');
    });
  }
  joinChannel(channel) {
    this.socket.emit('channel-join', channel)
  }
  addEventListener(event, fn) {
    this.socket.on(event, fn)
  }
  addMessageListener(fn) {
    this.socket.on('message', fn)
  }
  removeMessageListener(fn) {
    this.socket.off('message', fn)
  }
  sendMessage(channel, message) {
    this.socket.emit('message', this.token, channel, message)
  }
}
