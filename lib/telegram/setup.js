'use strict';

const tlReply = require('./reply');
const tlParse = require('./parse');

module.exports = function tlSetup(api, bot, logError, optionalParser, optionalResponder) {
  let parser = optionalParser || tlParse;
  let responder = optionalResponder || tlReply;
  
  api.post('/telegram', request => {
    let tlMessage = request.body.message;
    if (!tlMessage){
      return ;
    }
    let parsedMessage = parser(tlMessage);
    return bot(parsedMessage)
      .then(botResponse => responder(parsedMessage.sender, botResponse, request.env.telegramAccessToken))
      .catch(logError);
  });
};
