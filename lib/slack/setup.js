'use strict';

const prompt = require('souffleur');
const rp = require('minimal-request-promise');
const qs = require('querystring');
const slackReply = require('./reply');
const slackParse = require('./parse');
const color = require('../console-colors');

module.exports = function slackSetup(api, bot, logError, optionalParser, optionalResponder) {
  let parser = optionalParser || slackParse;
  let responder = optionalResponder || slackReply;

  // Hanlde Slack ssl_check GET request, info: https://api.slack.com/slash-commands#ssl
  api.get('/slack/slash-command', () => 'OK');

  api.post('/slack/slash-command', request => {
    if ((request.post.command &&
      (request.post.token === request.env.slackToken || request.post.token === request.env.slackVerificationToken))
      ||
      (request.post.trigger_word && request.post.token === request.env.slackWebhookToken))
      return bot(parser(request.post), request)
        .then(responder)
        .catch(logError);
    else
      return responder('unmatched token' + ' ' + request.post.token);
  });

  api.post('/slack/message-action', request => {
    const payload = JSON.parse(request.post.payload);
    if (payload.token === request.env.slackVerificationToken || payload.token === request.env.slackToken)
      return bot(parser(payload), request)
        .then(botResponder => {

          return responder(botResponder, payload.type);
        })
        .catch(logError);
    else
      return responder('unmatched token' + ' ' + payload.token);
  });

  api.get('/slack/landing', request => {
    return rp.post('https://slack.com/api/oauth.access', {
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
    return Promise.resolve().then(() => {
      if (options['configure-slack-slash-command']) {
        console.log(`\n\n${color.green}Slack slash command setup${color.reset}\n`);
        console.log(`\nFollowing info is required for the setup, for more info check the documentation.\n`);
        console.log(`\nNote that you can add one token for a slash command, and a second token for an outgoing webhook.\n`);
        console.log(`\nYour Slack slash command Request URL (POST only) is ${color.cyan}${lambdaDetails.apiUrl}/slack/slash-command${color.reset}\n`);
        console.log(`${color.dim}If you are building full-scale Slack app instead of just a slash command for your team, restart with --configure-slack-slash-app${color.reset} \n`);

        return prompt(['Slack token', 'Outgoing webhook token'])
          .then(results => {
            const deployment = {
              restApiId: lambdaDetails.apiId,
              stageName: lambdaDetails.alias,
              variables: {
                slackToken: results['Slack token'],
                slackWebhookToken: results['Outgoing webhook token']
              }
            };

            console.log(`\n`);

            return utils.apiGatewayPromise.createDeploymentPromise(deployment);
          });
      }

      if (options['configure-slack-slash-app']) {
        console.log(`\n\n${color.green}Slack App slash command setup${color.reset}\n`);
        console.log(`\nFollowing info is required for the setup, for more info check the documentation.\n`);
        console.log(`\nYour Slack redirect URL is ${color.cyan}${lambdaDetails.apiUrl}/slack/landing${color.reset}\n`);
        console.log(`\nYour Slack slash command Request URL (POST only) is ${color.cyan}${lambdaDetails.apiUrl}/slack/slash-command${color.reset}\n`);
        console.log(`\nIf you are using buttons, your Action URL is ${color.cyan}${lambdaDetails.apiUrl}/slack/message-action${color.reset}\n`);
        console.log(`${color.dim}If you are building just a slash command integration for your team and you don't need full-scale Slack app restart with --configure-slack-slash-command${color.reset} \n`);

        return prompt(['Slack Client ID', 'Slack Client Secret', 'Slack verification token', 'Home page URL'])
          .then(results => {
            const deployment = {
              restApiId: lambdaDetails.apiId,
              stageName: lambdaDetails.alias,
              variables: {
                slackClientId: results['Slack Client ID'],
                slackClientSecret: results['Slack Client Secret'],
                slackVerificationToken: results['Slack verification token'],
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
