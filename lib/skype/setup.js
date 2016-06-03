'use strict';

const skReply = require('./reply');
const skParse = require('./parse');
const skBearerToken = require('./token');
const retry = require('../retry');

const retryTimeout = 500;
const maxRetries = 2;

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
          }, retryTimeout, maxRetries,
          error => error.statusCode === 401, // expired / invalid token error status code
          skBearerToken.clearToken
        )
      }).catch(logError);
    };
    
    return Promise.all(arr.map(message => skParse(message)).map(skHandle))
    .then(() => 'ok');
  });
};
