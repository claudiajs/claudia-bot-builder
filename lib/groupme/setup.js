'use strict';

const prompt = require('souffleur');
const gmReply = require('./reply');
const gmParse = require('./parse');
const color = require('../console-colors');

module.exports = function gmSetup(api, bot, logError, optionalParser, optionalResponder) {
  let parser = optionalParser || gmParse;
  let responder = optionalResponder || gmReply;

  api.post('/groupme', request => {
    let arr = request.body instanceof Array ? [].concat.apply([], request.body) : [request.body];

    let gmHandle = parsedMessage => {
      if (!parsedMessage) return;
      return Promise.resolve(parsedMessage).then(parsedMessage => bot(parsedMessage, request))
        .then(botResponse => responder(botResponse, request.env.GROUPME_BOT_ID))
        .catch(logError);
    };

    return Promise.all(arr.map(message => gmHandle(parser(message))))
      .then(() => 'ok');
  });

  api.addPostDeployStep('groupme', (options, lambdaDetails, utils) => {
    return Promise.resolve()
      .then(() => {
        if (options['configure-groupme-bot']) {
          console.log(`\n\n${color.green}GroupMe setup${color.reset}\n`);
          console.log(`\nFollowing info is required for the setup, for more info check the documentation.\n`);
          console.log(`\nYour GroupMe bot Request URL (POST only) is ${color.cyan}${lambdaDetails.apiUrl}/groupme${color.reset}\n`);

          return prompt(['GroupMe Bot Id'])
            .then(results => {
              const deployment = {
                restApiId: lambdaDetails.apiId,
                stageName: lambdaDetails.alias,
                variables: {
                  GROUPME_BOT_ID: results['GroupMe Bot Id']
                }
              };

              return utils.apiGatewayPromise.createDeploymentPromise(deployment);
            });
        }
      })
      .then(() => `${lambdaDetails.apiUrl}/groupme`);
  });
};
