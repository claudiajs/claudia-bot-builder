'use strict';

const skReply = require('./reply');
const skParse = require('./parse');
const skBearerToken = require('./token');

module.exports = function skSetup(api, bot, logError) {

  api.post('/skype', request => {

    let arr = [].concat.apply([], request.body);
    let skContextId = request.headers['ContextId'];
    let authToken = skBearerToken.getToken();

    let skHandle = parsedMessage => {
      if (parsedMessage) {
        return bot(parsedMessage)
          .then(botResponse => skReply(parsedMessage.skypeId, botResponse, skContextId, authToken))
          .catch(logError);
      }
    };

    if (!authToken){
      return skBearerToken.requestToken(request.env.skypeAppId, request.evn.skypePrivateKey)
        .then(response => {
          authToken = response.access_token;
          skBearerToken.setToken(response.authToken);
          return Promise.all(arr.map(message => skParse(message)).map(skHandle))
        })
        .then(() => 'ok')
    }
    
    return Promise.all(arr.map(message => skParse(message)).map(skHandle))
    .then(() => 'ok');
  });
}
