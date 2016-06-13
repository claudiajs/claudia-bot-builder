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
  const api = new ApiBuilder(),
    messageHandlerPromise = function (message) {
      return Promise.resolve(message).then(messageHandler);
    };

  api.get('/', () => 'Ok');

  fbSetup(api, messageHandlerPromise, logError);
  slackSetup(api, messageHandlerPromise, logError);
  telegramSetup(api, messageHandlerPromise, logError);
  skypeSetup(api, messageHandlerPromise, logError);

  return api;
};
