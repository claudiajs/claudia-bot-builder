'use strict'

const rp = require('minimal-request-promise')
const qs = require('querystring')
const slackReply = require('./reply')
const slackParse = require('./parse')

module.exports = function slackSetup(api, bot, logError) {
  api.post('/slack/slash-command', request => {
    if (request.post.token === request.env.slackToken)
      return bot(slackParse(request.post))
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
}
