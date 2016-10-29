'use strict';

const rp = require('minimal-request-promise');
const prompt = require('souffleur');
const gmReply = require('./reply');
const gmParse = require('./parse');
const color = require('../console-colors');

module.exports = function kSetup(api, bot, logError, optionalParser, optionalResponder) {
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

    return Promise.all(arr.map(message => parser(message)).map(gmHandle))
      .then(() => 'ok');
  });

  api.addPostDeployStep('groupme', (options, lambdaDetails, utils) => {
    return utils.Promise.resolve()
      .then(() => {
        if (options['configure-groupme-bot']) {
          console.log(`\n\n${color.green}GroupMe setup${color.reset}\n`);
          console.log(`\nFollowing info is required for the setup, for more info check the documentation.\n`);
          console.log(`\nYour GroupMe bot Request URL (POST only) is ${color.cyan}${lambdaDetails.apiUrl}/groupme${color.reset}\n`);

          return prompt(['GroupMe Access Token', 'GroupMe Bot Name', 'GroupMe Bot Group ID'])
            .then(results => {
              const deployment = {
                restApiId: lambdaDetails.apiId,
                stageName: lambdaDetails.alias,
                variables: {
                  groupMeAccessToken: results['GroupMe Access Token'],
                  botName: results['GroupMe Bot Name'],
                  groupId: results['GroupMe Bot Group ID'],
                  GROUPME_BOT_ID: results['GroupMe Bot Id']
                }
              };

              return utils.apiGatewayPromise.createDeploymentPromise(deployment)
                .then(() => {

                  let options = {
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      name: deployment.variables.botName,
                      group_id: deployment.variables.group_id,
                      callback_url: `${lambdaDetails.apiUrl}/groupme`
                    })
                  };
                  return rp.post('https://api.groupme.com/v3/bots', options);
                });
            });
        }
      })
      .then(() => `${lambdaDetails.apiUrl}/groupme`);
  });
};
