'use strict';

const tlReply = require('./reply');
const tlParse = require('./parse');

module.exports = function tlSetup(api, bot, logError) {

  api.post('/telegram', request => {
    let tlMesssage = request.body.message;
    if (tlMessage == undefined){
      return tlReply()
    }
    let parsedMessage = tlParse(tlMessage)
    return bot(parsedMessage)
      .then(botResponse => tlReply(parsedMessage.sender, botResponse, request.env.telegramAccessToken))
      .catch(logError);
  });
}
