'use strict'

const fbReply = require('./reply')
const fbParse = require('./parse')

module.exports = function fbSetup(api, bot, logError) {
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
      if (parsedMessage) {
        var recipient = parsedMessage.sender;

        return bot(parsedMessage)
          .then(botResponse => fbReply(recipient, botResponse, request.env.facebookAccessToken))
          .catch(logError)
      }
    }

    return Promise.all(arr.map(message => fbParse(message)).map(fbHandle))
      .then(() => 'ok')
  })
}
