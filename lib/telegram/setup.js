'use strict';

const rp = require('minimal-request-promise');
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
    return utils.Promise.resolve()
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

              return utils.apiGatewayPromise.createDeploymentPromise(deployment)
                .then(() => {
                  let options = {
                    method: 'POST',
                    host: 'api.telegram.org',
                    path: `/bot${deployment.variables.telegramAccessToken}/setWebhook`,
                    port: 443,
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      url: `${lambdaDetails.apiUrl}/telegram`
                    })
                  };
                  return rp(options);
                });
            });
        }
      })
      .then(() => `${lambdaDetails.apiUrl}/telegram`);
  });
};
