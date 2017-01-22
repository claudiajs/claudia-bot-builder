'use strict';

const webReply = require('./reply');
const webParse = require('./parse');

module.exports = function webSetup(api, bot, logError, optionalParser, optionalResponder) {
  let parser = optionalParser || webParse;
  let responder = optionalResponder || webReply;

  api.post('/web', request => {
    let webMessage = request.body;

    let parsedMessage = parser(webMessage);

    if (!parsedMessage){
      return Promise.resolve('ok');
    }
    return Promise.resolve(parsedMessage)
        .then(parsedMessage => bot(parsedMessage, request))
        .then(botResponse => responder(botResponse))
        .catch(logError);
  });

};
