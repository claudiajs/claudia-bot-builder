'use strict';

const skReply = require('./reply');
const skParse = require('./parse');

module.exports = function skSetup(api, bot, logError) {

  api.post('/skype', request => {

    let arr = [].concat.apply([], request.body);
    let skContextId = request.headers['ContextId'];
    let skHandle = parsedMessage => {
      if (parsedMessage) {
        return bot(parsedMessage)
            .then(botResponse => skReply(parsedMessage.skypeId, botResponse, skContextId))
      .catch(logError);
      }
    };

    return Promise.all(arr.map(message => skParse(message)).map(skHandle))
    .then(() => 'ok');
  });
}
