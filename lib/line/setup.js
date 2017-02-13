'use strict';

const prompt = require('souffleur');
const lnReply = require('./reply');
const lnParse = require('./parse');
const validateLnRequestIntegrity = require('./validate-integrity');
const color = require('../console-colors');

module.exports = function lnSetup(api, bot, logError, optionalParser, optionalResponder) {
  let parser = optionalParser || lnParse;
  let responder = optionalResponder || lnReply;

  api.post('/line', request => {

    if (request.env.LINE_CHANNEL_SECRET && !validateLnRequestIntegrity(request)){
      return Promise.reject('X-Line-Signature does not match');
    }

    let arr = [].concat.apply([], request.body.events);
    let lnHandle = parsedMessage => {
      if (parsedMessage) {
        let replyToken = parsedMessage.replyToken;
        console.log(`replyToken in BOT RESPONSE is ${replyToken}`);

        return Promise.resolve(parsedMessage).then(parsedMessage => bot(parsedMessage, request))
        .then(botResponse => responder(replyToken, botResponse, new Buffer(request.env.LINE_CHANNEL_ACCESS_TOKEN, 'base64').toString('ascii')))
        .catch(logError);
      }
    };

    return Promise.all(arr.map(message => lnHandle(parser(message))))
  .then(() => 'ok');
  });

  api.addPostDeployStep('line', (options, lambdaDetails, utils) => {
    return Promise.resolve().then(() => {
      if (options['configure-line-bot']) {
        console.log(`\n\n${color.green}Line setup${color.reset}\n`);
        console.log(`\nFollowing info is required for the setup, for more info check the documentation.\n`);
        console.log(`\nYour LINE bot Request URL (POST only) is ${color.cyan}${lambdaDetails.apiUrl}/line${color.reset}\n`);

        return prompt(['LINE Channel Access Token', 'LINE Channel Secret'])
          .then(results => {
            const deployment = {
              restApiId: lambdaDetails.apiId,
              stageName: lambdaDetails.alias,
              variables: {
                LINE_CHANNEL_ACCESS_TOKEN: new Buffer(results['LINE Channel Access Token']).toString('base64'),
                LINE_CHANNEL_SECRET: new Buffer(results['LINE Channel Secret']).toString('base64')
              }
            };
            console.log(`\n`);

            return utils.apiGatewayPromise.createDeploymentPromise(deployment);
          });
      }
    })
      .then(() => `${lambdaDetails.apiUrl}/line`);
  });
};
