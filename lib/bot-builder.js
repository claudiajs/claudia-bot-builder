'use strict';

const ApiBuilder = require('claudia-api-builder');
const fbSetup = require('./facebook/setup');
const slackSetup = require('./slack/setup');
const telegramSetup = require('./telegram/setup');
const skypeSetup = require('./skype/setup');

function logError(err) {
  console.error(err);
}

module.exports = function botBuilder(messageHandler) {
  const api = new ApiBuilder();

  api.get('/', () => 'Ok');

  fbSetup(api, messageHandler, logError);
  slackSetup(api, messageHandler, logError);
  telegramSetup(api, messageHandler, logError);
  skypeSetup(api, messageHandler, logError);

  return api;
};
