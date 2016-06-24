'use strict';

const prompt = require('souffleur');
const rp = require('minimal-request-promise');
const qs = require('querystring');
const slackReply = require('./reply');
const slackParse = require('./parse');
const slackParseMessageAction = require('./parse-action');

module.exports = function slackSetup(api, bot, logError, optionalParser, optionalResponder) {
  let parser = optionalParser || slackParse;
  let responder = optionalResponder || slackReply;

  api.post('/slack/slash-command', request => {
    if (request.post.token === request.env.slackToken)
      return bot(parser(request.post), request)
        .then(responder)
        .catch(logError);
    else
      return responder('unmatched token' + ' ' + request.post.token + ' ' + request.env.slackToken);
  });

  api.post('/slack/message-action', request => {
    console.log(request.post.payload);
    console.log(JSON.parse(request.post.payload));
    const payload = JSON.parse(request.post.payload);
    if (payload.token === request.env.slackToken)
      return bot(slackParseMessageAction(payload), request)
        .then(response => console.log('response', response))
        .catch(logError);
    else
      return responder('unmatched token' + ' ' + request.post.token + ' ' + request.env.slackToken);
  });

  api.get('/slack/landing', request => {
    return rp({
      method: 'POST',
      hostname: 'slack.com',
      port: 443,
      path: '/api/oauth.access',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: qs.encode({
        client_id: request.env.slackClientId,
        client_secret: request.env.slackClientSecret,
        code: request.queryString.code,
        redirect_uri: request.env.slackRedirectUrl
      })
    })
      .then(() => request.env.slackHomePageUrl);
  }, {
    success: 302
  });

  api.addPostDeployStep('slackSlashCommand', (options, lambdaDetails, utils) => {
    return utils.Promise.resolve().then(() => {
      if (options['configure-slack-slash-command']) {
        console.log(`\nYour Slack slash command Request URL (POST only) is ${lambdaDetails.apiUrl}/slack/slash-command\n`);
        console.log(`If you are building full-scale Slack app instead of just a slash command for your team, restart with --configure-slack-slash-app \n`);

        return prompt(['Slack token'])
          .then(results => {
            const deployment = {
              restApiId: lambdaDetails.apiId,
              stageName: lambdaDetails.alias,
              variables: {
                slackToken: results['Slack token']
              }
            };

            console.log(`\n`);

            return utils.apiGatewayPromise.createDeploymentPromise(deployment);
          });
      }

      if (options['configure-slack-slash-app']) {
        console.log(`\nYour Slack redirect URL is ${lambdaDetails.apiUrl}/slack/landing\n`);
        console.log(`\nYour Slack slash command Request URL (POST only) is ${lambdaDetails.apiUrl}/slack/slash-command\n`);
        console.log(`If you are building just a slash command integration for your team and you don't need full-scale Slack app restart with --configure-slack-slash-command \n`);

        return prompt(['Slack Client ID', 'Slack Client Secret', 'Slack token', 'Home page URL'])
          .then(results => {
            const deployment = {
              restApiId: lambdaDetails.apiId,
              stageName: lambdaDetails.alias,
              variables: {
                slackClientId: results['Slack Client ID'],
                slackClientSecret: results['Slack Client Secret'],
                slackToken: results['Slack token'],
                slackHomePageUrl: results['Home page URL'],
                slackRedirectUrl: `${lambdaDetails.apiUrl}/slack/landing`
              }
            };

            console.log(`\n`);

            return utils.apiGatewayPromise.createDeploymentPromise(deployment);
          });
      }
    })
      .then(() => `${lambdaDetails.apiUrl}/slack/slash-command`);
  });
};
