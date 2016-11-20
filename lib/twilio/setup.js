'use strict';

const prompt = require('souffleur');
const twilioReply = require('./reply');
const twilioParse = require('./parse');
const color = require('../console-colors');

module.exports = function twilioSetup(api, bot, logError, optionalParser, optionalResponder) {
  let parser = optionalParser || twilioParse;
  let responder = optionalResponder || twilioReply;


  api.post('/twilio', request => {
    let arr = request.body instanceof Array ? [].concat.apply([], request.body) : [request.body];

    let twilioHandle = parsedMessage => {
      if (!parsedMessage) return;
      return Promise.resolve(parsedMessage).then(parsedMessage => bot(parsedMessage, request))
        .then(botResponse => responder(request.env.TWILIO_ACCOUNT_SID, request.env.TWILIO_AUTH_TOKEN, new Buffer(request.env.TWILIO_NUMBER, 'base64').toString('ascii'), parsedMessage.sender, botResponse))
        .catch(logError);
    };

    return Promise.all(arr.map(message => parser(message)).map(twilioHandle))
      .then(() => '<Response></Response>');
  }, { success: { contentType: 'text/xml' }});

  api.addPostDeployStep('twilio', (options, lambdaDetails, utils) => {
    return Promise.resolve().then(() => {
      if (options['configure-twilio-sms-bot']) {
        console.log(`\n\n${color.green}Twilio SMS setup${color.reset}\n`);
        console.log(`\nFollowing info is required for the setup, for more info check the documentation.\n`);

        return prompt(['Twilio Account ID', 'Twilio Auth Token', 'Twilio Number used for Sending'])
          .then(results => {
            const deployment = {
              restApiId: lambdaDetails.apiId,
              stageName: lambdaDetails.alias,
              variables: {
                TWILIO_ACCOUNT_SID: results['Twilio Account ID'],
                TWILIO_AUTH_TOKEN: results['Twilio Auth Token'],
                TWILIO_NUMBER: new Buffer(results['Twilio Number used for Sending']).toString('base64')
              }
            };

            return utils.apiGatewayPromise.createDeploymentPromise(deployment);
          });
      }
    })
      .then(() => `${lambdaDetails.apiUrl}/twilio`);
  });
};
