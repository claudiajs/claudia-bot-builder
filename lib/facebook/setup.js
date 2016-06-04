'use strict';

const fbReply = require('./reply');
const fbParse = require('./parse');

module.exports = function fbSetup(api, bot, logError, optionalParser, optionalResponder) {
  let parser = optionalParser || fbParse;
  let responder = optionalResponder || fbReply;

  api.get('/facebook', request => {
    if (request.queryString['hub.verify_token'] === request.env.facebookVerifyToken)
      return request.queryString['hub.challenge'];

    logError(`Facebook can't verify the token. It expected '${request.env.facebookVerifyToken}', but got '${request.queryString['hub.verify_token']}'. Make sure you are using the same token you set in 'facebookVerifyToken' stage env variable.`);
    return 'Error';
  }, {success: {contentType: 'text/plain'}});

  api.post('/facebook', request => {
    let arr = [].concat.apply([], request.body.entry.map(entry => entry.messaging));
    let fbHandle = parsedMessage => {
      if (parsedMessage) {
        var recipient = parsedMessage.sender;

        return Promise.resolve(parsedMessage).then(bot)
          .then(botResponse => responder(recipient, botResponse, request.env.facebookAccessToken))
          .catch(logError);
      }
    };

    return Promise.all(arr.map(message => parser(message)).map(fbHandle))
      .then(() => 'ok');
  });
};
