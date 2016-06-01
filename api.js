'use strict'

const apiBuilder = require('claudia-api-builder')
const api = new apiBuilder()
const bot = require('./lib/bot')
const parser = require('./lib/parser')
const send = require('./lib/send')
const rp = require('minimal-request-promise')
const qs = require('querystring')

function logError(err) {
  console.error(err)
}

function fbReply(recipient, message, fbAccessToken) {
  console.log('FB reply', recipient, message, fbAccessToken)
  return send.text(recipient, message, fbAccessToken)
}

function slackReply(botResponse) {
  if (typeof botResponse === 'string')
    return {
      text: botResponse
    }

  return botResponse
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

api.post('/slack/slash-command', request => {
  if (request.post.token === request.env.slackToken)
    return bot(parser.slackSlashCommand(request.post))
      .then(slackReply)
      .catch(logError)
  else
    return slackReply('unmatched token' + ' ' + request.post.token + ' ' + request.env.slackToken)
})

api.get('/slack/landing', request => {
  return rp({
    method: 'POST',
    hostname: 'slack.com',
    port: 443,
    path: '/api/oauth.access',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: qs.encode({
      client_id: request.env.slackClientId,
      client_secret: request.env.slackClientSecret,
      code: request.queryString.code,
      redirect_uri: request.env.slackRedirectUrl
    })
  })
    .then(response => `<p>Thanks for installing the app.</p>`)

}, {
  success: { contentType: 'text/html' }
})
