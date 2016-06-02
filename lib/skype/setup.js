'use strict';

const skReply = require('./reply');
const skParse = require('./parse');
const skBearerToken = require('./token');

module.exports = function skSetup(api, bot, logError) {

  api.post('/skype', request => {
    console.log(request)
    let arr = [].concat.apply([], request.body);

    let skContextId = request.headers.contextid;
    let authToken = skBearerToken.getToken();

    let skHandle = parsedMessage => {
      if (parsedMessage) {
        return bot(parsedMessage)
          .then(botResponse => skReply(parsedMessage.skypeId, botResponse, skContextId, authToken))
          .catch(logError);
      }
    };

    if (!authToken){
      return skBearerToken.requestToken(request.env.skypeAppId, request.env.skypePrivateKey)
        .then(response => {
          var body = JSON.parse(response.body);
          authToken = body.access_token;
          skBearerToken.setToken(response.authToken);
          return Promise.all(arr.map(message => skParse(message)).map(skHandle))
        })
        .then(() => 'ok')
    }
    
    return Promise.all(arr.map(message => skParse(message)).map(skHandle))
    .then(() => 'ok');
  });
}
