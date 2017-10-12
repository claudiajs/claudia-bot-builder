'use strict';

const prompt = require('souffleur');
const skReply = require('./reply');
const skParse = require('./parse');
const color = require('../console-colors');

module.exports = function skSetup(api, bot, logError, optionalParser, optionalResponder) {
  let parser = optionalParser || skParse;
  let responder = optionalResponder || skReply;


  api.post('/skype', request => {
    let arr = request.body instanceof Array ? [].concat.apply([], request.body) : [request.body];

    let skHandle = parsedMessage => {
      if (!parsedMessage) return;
      return Promise.resolve(parsedMessage).then(parsedMessage => bot(parsedMessage, request))
        .then(botResponse => responder(request.env.skypeAppId, request.env.skypePrivateKey, parsedMessage.sender, botResponse, parsedMessage.originalRequest.serviceUrl, parsedMessage.originalRequest.id))
        .catch(logError);
    };

    return Promise.all(arr.map(message => skHandle(parser(message))))
      .then(() => 'ok');
  });

  api.addPostDeployStep('skype', (options, lambdaDetails, utils) => {
    return Promise.resolve().then(() => {
      if (options['configure-skype-bot']) {
        console.log(`\n\n${color.green}Skype setup${color.reset}\n`);
        console.log(`\nFollowing info is required for the setup, for more info check the documentation.\n`);

        return prompt(['Skype App ID', 'Skype Private key'])
          .then(results => {
            const deployment = {
              restApiId: lambdaDetails.apiId,
              stageName: lambdaDetails.alias,
              variables: {
                skypeAppId: results['Skype App ID'],
                skypePrivateKey: results['Skype Private key']
              }
            };

            return utils.apiGatewayPromise.createDeploymentPromise(deployment);
          });
      }
    })
      .then(() => `${lambdaDetails.apiUrl}/skype`);
  });
};
