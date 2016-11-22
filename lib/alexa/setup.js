'use strict';

const prompt = require('souffleur');
const alexaParse = require('./parse');
const alexaReply = require('./reply');
const color = require('../console-colors');
const envUtils = require('../utils/env-utils');

module.exports = function alexaSetup(api, bot, logError, optionalParser, optionalResponder) {
  let parser = optionalParser || alexaParse;
  let responder = optionalResponder || alexaReply;

  api.post('/alexa', request => {
    return bot(parser(request.body), request)
      .then(botReply => responder(botReply, envUtils.decode(request.env.alexaAppName)))
      .catch(logError);
  });

  api.addPostDeployStep('alexa', (options, lambdaDetails, utils) => {
    return Promise.resolve().then(() => {
      if (options['configure-alexa-skill']) {
        console.log(`\n\n${color.green}Alexa skill command setup${color.reset}\n`);
        console.log(`\nConfigure your Alexa Skill endpoint to HTTPS and set this URL:.\n`);
        console.log(`\n${color.cyan}${lambdaDetails.apiUrl}/alexa${color.reset}\n`);
        console.log(`\nIn the SSL Certificate step, select "${color.dim}My development endpoint is a sub-domain of a domain that has a wildcard certificate from a certificate authority${color.reset}".\n`);

        return prompt(['Alexa bot name'])
          .then(results => {
            const deployment = {
              restApiId: lambdaDetails.apiId,
              stageName: lambdaDetails.alias,
              variables: {
                alexaAppName: envUtils.encode(results['Alexa bot name'])
              }
            };

            console.log(`\n`);

            return utils.apiGatewayPromise.createDeploymentPromise(deployment);
          });
      }
    })
      .then(() => `${lambdaDetails.apiUrl}/alexa`);
  });
};
