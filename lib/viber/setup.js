'use strict';

const rp = require('minimal-request-promise');
const prompt = require('souffleur');
const vbReply = require('./reply');
const vbParse = require('./parse');
const color = require('../console-colors');

module.exports = function vbSetup(api, bot, logError, optionalParser, optionalResponder) {
  let parser = optionalParser || vbParse;
  let responder = optionalResponder || vbReply;

  api.post('/viber', request => {
    let vbMessage = request.body;

    let parsedMessage = parser(vbMessage);

    if (!parsedMessage){
      return Promise.resolve('ok');
    }
    return Promise.resolve(parsedMessage)
      .then(parsedMessage => bot(parsedMessage, request))
      .then(botResponse => responder(parsedMessage.sender, botResponse, request.env.viberAccessToken))
      .catch(logError);
  });

  api.addPostDeployStep('viber', (options, lambdaDetails, utils) => {
    return Promise.resolve()
      .then(() => {
        if (options['configure-viber-bot']) {
          console.log(`\n\n${color.green}Viber setup${color.reset}\n`);
          console.log(`\nFollowing info is required for the setup, for more info check the documentation.\n`);
          console.log(`\nYour Viber bot Request URL (POST only) is ${color.cyan}${lambdaDetails.apiUrl}/viber${color.reset}\n`);

          return prompt(['Viber Access Token'])
            .then(results => {
              const deployment = {
                restApiId: lambdaDetails.apiId,
                stageName: lambdaDetails.alias,
                variables: {
                  viberAccessToken: results['Viber Access Token']
                }
              };

              return utils.apiGatewayPromise.createDeploymentPromise(deployment)
                .then(() => {
                  let body = JSON.stringify({
                    auth_token: deployment.variables.viberAccessToken,
                    url: `${lambdaDetails.apiUrl}/viber`,
                    event_types: ['delivered', 'seen']
                  });
                  let options = {
                    headers: {
                      'Content-Type': 'application/json',
                      'Content-Length': Buffer.byteLength(body, 'utf8')
                    },
                    body: body
                  };
                  return rp.post(`https://chatapi.viber.com/pa/set_webhook`, options);
                });
            });
        }
      })
      .then(() => `${lambdaDetails.apiUrl}/viber`);
  });
};
