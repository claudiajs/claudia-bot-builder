'use strict';

const prompt = require('prompt');
const rp = require('minimal-request-promise');
const qs = require('querystring');
const slackReply = require('./reply');
const slackParse = require('./parse');

module.exports = function slackSetup(api, bot, logError) {
  api.post('/slack/slash-command', request => {
    if (request.post.token === request.env.slackToken)
      return bot(slackParse(request.post))
        .then(slackReply)
        .catch(logError);
    else
      return slackReply('unmatched token' + ' ' + request.post.token + ' ' + request.env.slackToken);
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
      .then(() => `<!doctype html><html><head><meta http-equiv="refresh" content="1;url=${request.env.slackHomePageUrl}" /></head><body><p>Thanks for installing the app. You will be redirected in a second.</p></body></html>`);

  }, {
    success: {
      contentType: 'text/html'
    }
  });
  
  api.addPostDeployStep('slackSlashCommand', (options, lambdaDetails, utils) => {
    return utils.Promise.resolve().then(() => {
      if (options['configure-slack-slash-command']) {
        console.log('');
        console.log(`Your Slack redirect URL is ${lambdaDetails.apiUrl}/slack/landing`);
        console.log('');

        utils.Promise.promisifyAll(prompt);

        prompt.start();
        return prompt.getAsync(['Slack Client ID', 'Slack Client Secret', 'Slack token', 'Home page URL'])
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

            console.log(`
            `);

            return utils.apiGatewayPromise.createDeploymentPromise(deployment);
          });
      }
    })
    .then(() => `${lambdaDetails.apiUrl}/slack/slash-command`);
  });
};
