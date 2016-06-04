'use strict';

const tlReply = require('./reply');
const tlParse = require('./parse');

module.exports = function tlSetup(api, bot, logError, optionalParser, optionalResponder) {
  let parser = optionalParser || tlParse;
  let responder = optionalResponder || tlReply;

  api.post('/telegram', request => {
    let tlMessage = request.body.message;

    let parsedMessage = parser(tlMessage);
    if (!parsedMessage){
      return Promise.resolve('ok');
    }
    return Promise.resolve(parsedMessage).then(bot)
      .then(botResponse => responder(parsedMessage.sender, botResponse, request.env.telegramAccessToken))
      .catch(logError);
  });
};
