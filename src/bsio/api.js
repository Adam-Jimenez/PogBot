const axios = require('axios')

const api = axios.create({
  baseURL: 'https://binarysearch.com/api/',
  headers: {} // token is added after login
});

exports.login = async function(username, password) {
  loginEndpoint = 'https://binarysearch.com/api/users/login'
  return api.post(loginEndpoint, {
    username, 
    password 
  }).then(res => {
    const token = res.data.token
    Object.assign(api.defaults, {
      headers: {
        'x-access-token': token
      }
    });
    return res.data
  }).catch(err => {
    console.error(err)
  })
}

exports.getChannels = async function(userId) {
  channelEndpoint = `/users/${userId}/groups` 
  return api.get(channelEndpoint).then(res => {
    /*
     * slug is a unique identifier used to connect
     * to the websocket of a room
     */
    channel_to_slug = {}
    res.data.groups.forEach(group => {
      channel_to_slug[group.slug] = group.channelSlug
    })
    return channel_to_slug
  }).catch(err => {
    console.error(err)
  })
}
