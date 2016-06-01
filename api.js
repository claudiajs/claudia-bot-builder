'use strict'

const apiBuilder = require('claudia-api-builder')
const api = new apiBuilder()
const bot = require('./lib/bot')
const parser = require('./lib/parser')
const send = require('./lib/send')

function logError(err) {
  console.error(err)
}

function fbReply(recipient, message, fbAccessToken) {
  console.log('FB reply', recipient, message, fbAccessToken)
  return send.text(recipient, message, fbAccessToken)
}

module.exports = api

api.get('/', () => 'ok')

// Get webhook - for verification
api.get('/facebook', request => {
  // Verify webhook if verify token is sent
  if (request.queryString['hub.verify_token'] === request.env.facebookVerifyToken)
    return parseInt(request.queryString['hub.challenge'], 10)

  // Return an error otherwise
  return 'Error'
})

api.post('/facebook', request => {
  let arr = [].concat.apply([], request.body.entry.map(entry => entry.messaging))
  let fbHandle = parsedMessage => {
    console.log('Parsed message', parsedMessage)

    if (parsedMessage) {
      var recipient = parsedMessage.sender;
      
      return bot(parsedMessage)
        .then(botResponse => fbReply(recipient, botResponse, request.env.facebookAccessToken))
        .catch(logError)
    }
  }

  return Promise.all(arr.map(message => parser.fb(message)).map(fbHandle))
    .then(() => 'ok')
})
