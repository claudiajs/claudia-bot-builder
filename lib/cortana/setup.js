'use strict';

const prompt = require('souffleur');
const cortanaParse = require('./parse');
const cortanaReply = require('./reply');
const color = require('../console-colors');
const builder = require('botbuilder');
const envUtils = require('../utils/env-utils');

let connector = null;
let universalBot = null;

let self = this;
self.chatConnectorRequestListener = null;
self.promiseResolver = null;

module.exports = function cortanaSetup(api, bot, logError, optionalParser, optionalResponder) {
  let parser = optionalParser || cortanaParse;
  let responder = optionalResponder || cortanaReply;

  api.post('/cortana', (request) => {
    if (connector == null) {
      connector = new builder.ChatConnector({
        appId: envUtils.decode(request.env.cortanaAppId),
        appPassword: envUtils.decode(request.env.cortanaAppPassword)
      });

      universalBot = new builder.UniversalBot(connector, (session) => {
        let message = parser(session, request);
        bot(message, request)
          .then(botReply => {
            responder(botReply, session);
          })
          .catch(logError);
      });

      let oldSend = universalBot.send;
      universalBot.send = function(messages, done) {
        let newDone = function () {
          done();
          self.promiseResolver();
        };
        oldSend.call(universalBot, messages, newDone);
      };

      universalBot.use({
        receive: function(event, next) {
          if(event.type === 'conversationUpdate') {
            self.promiseResolver();
          }
          next();
        },
        send: function(event, next) {
          next();
        }
      });

      self.chatConnectorRequestListener = connector.listen();
    }

    let promise = new Promise((resolve) => {
      self.promiseResolver = resolve;
      let reqWrapper = {
        body: request.body,
        headers: request.headers
      };
      let resWrapper = {
        status: () => {
        },
        end: () => {
        }
      };
      self.chatConnectorRequestListener(reqWrapper, resWrapper);
    });
    return promise;
  });

  api.addPostDeployStep('cortana', (options, lambdaDetails, utils) => {
    return Promise.resolve().then(() => {
      if (options['configure-cortana-skill']) {
        console.log(`\n\n${color.green}Cortana skill command setup${color.reset}\n`);
        console.log(`\nConfigure your Cortana Skill endpoint to HTTPS and set this URL:.\n`);
        console.log(`\n${color.cyan}${lambdaDetails.apiUrl}/cortana${color.reset}\n`);
        console.log(`\nIn the SSL Certificate step, select "${color.dim}My development endpoint is a sub-domain of a domain that has a wildcard certificate from a certificate authority${color.reset}".\n`);

        return prompt(['appId', 'appPassword'])
          .then(results => {
            const deployment = {
              restApiId: lambdaDetails.apiId,
              stageName: lambdaDetails.alias,
              variables: {
                cortanaAppId: envUtils.encode(results['appId']),
                cortanaAppPassword: envUtils.encode(results['appPassword'])
              }
            };
            console.log(`\n`);

            return utils.apiGatewayPromise.createDeploymentPromise(deployment);
          });
      }
    }).then(() => `${lambdaDetails.apiUrl}/cortana`);
  });
};
