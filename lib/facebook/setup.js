'use strict';

const crypto = require('crypto');
const prompt = require('prompt');
const fbReply = require('./reply');
const fbParse = require('./parse');

module.exports = function fbSetup(api, bot, logError, optionalParser, optionalResponder) {
  let parser = optionalParser || fbParse;
  let responder = optionalResponder || fbReply;

  api.get('/facebook', request => {
    if (request.queryString['hub.verify_token'] === request.env.facebookVerifyToken)
      return request.queryString['hub.challenge'];
    return 'Error';
  }, {success: {contentType: 'text/plain'}});

  api.post('/facebook', request => {
    let arr = [].concat.apply([], request.body.entry.map(entry => entry.messaging));
    let fbHandle = parsedMessage => {
      if (parsedMessage) {
        var recipient = parsedMessage.sender;

        return Promise.resolve(parsedMessage).then(bot)
          .then(botResponse => responder(recipient, botResponse, request.env.facebookAccessToken))
          .catch(logError);
      }
    };

    return Promise.all(arr.map(message => parser(message)).map(fbHandle))
      .then(() => 'ok');
  });

  api.addPostDeployStep('facebook', (options, lambdaDetails, utils) => {
    return utils.Promise.resolve().then(() => {
      if (options['configure-fb-bot']) {
        let token;

        utils.Promise.promisifyAll(prompt);
        utils.Promise.promisifyAll(crypto);

        return utils.apiGatewayPromise.getStagePromise({
          restApiId: lambdaDetails.apiId,
          stageName: lambdaDetails.alias
        })
          .then(data => {
            if (data.variables && data.variables.facebookVerifyToken)
              return data.variables.facebookVerifyToken;

            return crypto.randomBytesAsync(8);
          })
          .then(rawToken => {
            token = rawToken.toString();
            return utils.apiGatewayPromise.createDeploymentPromise({
              restApiId: lambdaDetails.apiId,
              stageName: lambdaDetails.alias,
              variables: {
                facebookVerifyToken: token
              }
            });
          })
          .then(() => {
            // Do not delete empty console.logs and closing brackets in new lines
            // They are used as a new line separators
            console.log('');
            console.log(`Your webhook URL is: ${lambdaDetails.apiUrl}/facebook
            `);
            console.log(`Your verify token is: ${token}
            `);

            prompt.start();
            return prompt.getAsync(['Facebook access token']);
          })
          .then(results => {
            console.log(`
            `);
            const deployment = {
              restApiId: lambdaDetails.apiId,
              stageName: lambdaDetails.alias,
              variables: {
                facebookAccessToken: results['Facebook access token']
              }
            };

            return utils.apiGatewayPromise.createDeploymentPromise(deployment);
          });
      }
    })
      .then(() => `${lambdaDetails.apiUrl}/facebook`);
  });
};
