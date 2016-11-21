'use strict';

const rp = require('minimal-request-promise');
const prompt = require('souffleur');
const kReply = require('./reply');
const kParse = require('./parse');
const color = require('../console-colors');

module.exports = function kSetup(api, bot, logError, optionalParser, optionalResponder) {
  let parser = optionalParser || kParse;
  let responder = optionalResponder || kReply;

  api.post('/kik', request => {
    let arr = [].concat.apply([], request.body.messages);
    let kikHandle = parsedMessage => {
      if (parsedMessage){
        return Promise.resolve(parsedMessage).then(parsedMessage => bot(parsedMessage, request))
          .then(botResponse => responder(parsedMessage, botResponse, request.env.kikUserName, request.env.kikApiKey))
          .catch(logError);
      }
    };

    return Promise.all(arr.map(message => kikHandle(parser(message))))
      .then(() => 'ok');
  });

  api.addPostDeployStep('kik', (options, lambdaDetails, utils) => {
    return Promise.resolve()
      .then(() => {
        if (options['configure-kik-bot']) {
          console.log(`\n\n${color.green}Kik setup${color.reset}\n`);
          console.log(`\nFollowing info is required for the setup, for more info check the documentation.\n`);
          console.log(`\nYour Kik bot Request URL (POST only) is ${color.cyan}${lambdaDetails.apiUrl}/kik${color.reset}\n`);

          return prompt(['Kik Bot Username', 'Kik Api Key'])
            .then(results => {
              const deployment = {
                restApiId: lambdaDetails.apiId,
                stageName: lambdaDetails.alias,
                variables: {
                  kikUserName: results['Kik Bot Username'],
                  kikApiKey: results['Kik Api Key']
                }
              };

              return utils.apiGatewayPromise.createDeploymentPromise(deployment)
                .then(() => {

                  let options = {
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Basic ${new Buffer(deployment.variables.kikUserName + ':' + deployment.variables.kikApiKey).toString('base64')}`
                    },
                    body: JSON.stringify({
                      webhook: `${lambdaDetails.apiUrl}/kik`,
                      features: {
                        receiveReadReceipts: false,
                        receiveIsTyping: false,
                        manuallySendReadReceipts: false,
                        receiveDeliveryReceipts: false
                      }
                    })
                  };
                  return rp.post(`https://api.kik.com/v1/config`, options);
                });
            });
        }
      })
      .then(() => `${lambdaDetails.apiUrl}/kik`);
  });
};
