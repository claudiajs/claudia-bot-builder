'use strict';

const rp = require('minimal-request-promise');
const prompt = require('souffleur');
const tlReply = require('./reply');
const tlParse = require('./parse');
const color = require('../console-colors');

module.exports = function tlSetup(api, bot, logError, optionalParser, optionalResponder) {
  let parser = optionalParser || tlParse;
  let responder = optionalResponder || tlReply;

  api.post('/telegram', request => {
    let tlMessage = request.body;

    let parsedMessage = parser(tlMessage);
    if (!parsedMessage){
      return Promise.resolve('ok');
    }
    return Promise.resolve(parsedMessage).then(parsedMessage => bot(parsedMessage, request))
      .then(botResponse => responder(parsedMessage, botResponse, request.env.telegramAccessToken))
      .catch(logError);
  });

  api.addPostDeployStep('telegram', (options, lambdaDetails, utils) => {
    return Promise.resolve()
      .then(() => {
        if (options['configure-telegram-bot']) {
          console.log(`\n\n${color.green}Telegram setup${color.reset}\n`);
          console.log(`\nFollowing info is required for the setup, for more info check the documentation.\n`);
          console.log(`\nYour Telegram bot Request URL (POST only) is ${color.cyan}${lambdaDetails.apiUrl}/telegram${color.reset}\n`);
          console.log(`\nIf you want your bot to receive inline queries\n just send /setinline to the @BotFather on your Telegram client and choose your bot\n`);

          return prompt(['Telegram Access Token'])
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
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      url: `${lambdaDetails.apiUrl}/telegram`
                    })
                  };
                  return rp.post(`https://api.telegram.org/bot${deployment.variables.telegramAccessToken}/setWebhook`, options);
                });
            });
        }
      })
      .then(() => `${lambdaDetails.apiUrl}/telegram`);
  });
};
