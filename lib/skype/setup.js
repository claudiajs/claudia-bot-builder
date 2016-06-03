'use strict';

const skReply = require('./reply');
const skParse = require('./parse');
const skBearerToken = require('./token');
const retry = require('../retry');

module.exports = function skSetup(api, bot, logError) {

  api.post('/skype', request => {
    let arr = [].concat.apply([], request.body),
      skContextId = request.headers.contextid;

    let skHandle = parsedMessage => {
      if (!parsedMessage) return;
      return bot(parsedMessage).then(botResponse => {
        return retry(() => {
            return skBearerToken.getToken(request.env.skypeAppId, request.env.skypePrivateKey)
              .then((token) => skReply(parsedMessage.skypeId, botResponse, skContextId, token))
          }, 500, 2,
          error => error.statusCode === 401,
          skBearerToken.clearToken
        )
      }).catch(logError);
    };
    
    return Promise.all(arr.map(message => skParse(message)).map(skHandle))
    .then(() => 'ok');
  });
};
