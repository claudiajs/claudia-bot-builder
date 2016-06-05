'use strict';

const prompt = require('prompt');
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

  api.addPostDeployStep('telegram', (options, lambdaDetails, utils) => {
    utils.Promise.resolve()
      .then(() => {
        if (options['configure-telegram-bot']) {
          utils.Promise.promisifyAll(prompt);

          prompt.start();
          return prompt.getAsync(['Telegram Access Token'])
            .then(results => {
              const deployment = {
                restApiId: lambdaDetails.apiId,
                stageName: lambdaDetails.alias,
                variables: {
                  telegramAccessToken: results['Telegram Access Token']
                }
              };

              return utils.apiGatewayPromise.createDeploymentPromise(deployment);
            });
        }
      })
      .then(() => `${lambdaDetails.apiUrl}/telegram`);
  });
};
