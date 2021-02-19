'use strict';

const prompt = require('souffleur');
const googleHangoutsParse = require('./parse');
const googleHangoutsReply = require('./reply');
const color = require('../console-colors');
const envUtils = require('../utils/env-utils');

module.exports = function googleHangoutsSetup(api, bot, logError, optionalParser, optionalResponder) {
  let parser = optionalParser || googleHangoutsParse;
  let responder = optionalResponder || googleHangoutsReply;

  api.post('/google-hangouts-chat', request => {
    return bot(parser(request.body), request)
      .then(botReply => responder(botReply, envUtils.decode(request.env.googleHangoutsAppName)))
      .catch(logError);
  });

  api.addPostDeployStep('google-hangouts-chat', (options, lambdaDetails, utils) => {
    return Promise.resolve().then(() => {
      if (options['configure-google-hangouts-chat-bot']) {
        console.log(`\n\n${color.green}Google Hangouts Chat bot setup${color.reset}\n`);
        console.log(`\nConfigure your Google Hangouts Chat bot endpoint to HTTPS and set this URL:.\n`);
        console.log(`\n${color.cyan}${lambdaDetails.apiUrl}/google-hangouts-chat${color.reset}\n`);

        return prompt(['Google Hangouts Chat bot name'])
          .then(results => {
            const deployment = {
              restApiId: lambdaDetails.apiId,
              stageName: lambdaDetails.alias,
              variables: {
                googleHangoutsAppName: envUtils.encode(results['Google Hangouts Chat bot name'])
              }
            };

            console.log(`\n`);

            return utils.apiGatewayPromise.createDeploymentPromise(deployment);
          });
      }
    })
      .then(() => `${lambdaDetails.apiUrl}/google-hangouts-chat`);
  });
};
