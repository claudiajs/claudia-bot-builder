'use strict';

const skReply = require('./reply');
const skParse = require('./parse');

module.exports = function skSetup(api, bot, logError) {

  api.post('/skype', request => {
    let arr = [].concat.apply([], request.body),
      skContextId = request.headers.contextid;

    let skHandle = parsedMessage => {
      if (!parsedMessage) return;
      return bot(parsedMessage)
        .then(botResponse => skReply(request.env.skypeAppId, request.env.skypePrivateKey, parsedMessage.skypeId, botResponse, skContextId))
        .catch(logError);
    };
    
    return Promise.all(arr.map(message => skParse(message)).map(skHandle))
    .then(() => 'ok');
  });
};
