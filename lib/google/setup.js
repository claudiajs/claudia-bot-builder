'use strict';

const prompt = require('souffleur');
const googleParse = require('./parse');
const googleReply = require('./reply');
const color = require('../console-colors');
const envUtils = require('../utils/env-utils');
const { ActionsSdkApp } = require('actions-on-google');
const expressMockery = require('node-mocks-http');

module.exports = function googleSetup(api, bot, logError, optionalParser, optionalResponder) {
  let parser = optionalParser || googleParse;
  let responder = optionalResponder || googleReply;

  api.post('/google', (request) => {
    const assistant = getAssistant(request);
    return bot(parser(assistant, request), request)
      .then(botReply => {
        return responder(botReply, envUtils.decode(request.env.googleAppName), assistant);
      })
      .catch(logError);
  });

  api.addPostDeployStep('google', (options, lambdaDetails, utils) => {
    return Promise.resolve().then(() => {
      if (options['configure-google-action']) {
        console.log(`\n\n${color.green}Google Action command setup${color.reset}\n`);
        console.log(`\nConfigure your Google Action endpoint to HTTPS and set this URL:.\n`);
        console.log(`\n${color.cyan}${lambdaDetails.apiUrl}/google${color.reset}\n`);
        console.log(`\nIn the SSL Certificate step, select "${color.dim}My development endpoint is a sub-domain of a domain that has a wildcard certificate from a certificate authority${color.reset}".\n`);

        return prompt(['Google App Name'])
          .then(results => {
            const deployment = {
              restApiId: lambdaDetails.apiId,
              stageName: lambdaDetails.alias,
              variables: {
                googleAppName: envUtils.encode(results['Google App Name'])
              }
            };

            console.log(`\n`);

            return utils.apiGatewayPromise.createDeploymentPromise(deployment);
          });
      }
    })
      .then(() => `${lambdaDetails.apiUrl}/google`);
  });
};

function getAssistant(request) {

  // Prep the request and response.
  var mockRequest = expressMockery.createRequest({
    body: request.body
  });

  var mockResponse = expressMockery.createResponse();

  // We need this monkey patch because node-mocks-http doesn't have the append.
  mockResponse['append'] = (header, value) => {
    console.log('Google SDK added a header: "' + header + '": "' + value + '"');
  };

  // Feed the request/response to the assistant SDK
  return new ActionsSdkApp({ request: mockRequest, response: mockResponse });
}
