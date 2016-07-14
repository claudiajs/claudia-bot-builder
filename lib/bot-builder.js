'use strict';

const ApiBuilder = require('claudia-api-builder');
const fbSetup = require('./facebook/setup');
const slackSetup = require('./slack/setup');
const telegramSetup = require('./telegram/setup');
const skypeSetup = require('./skype/setup');
const fbTemplate = require('./facebook/format-message');
const slackTemplate = require('./slack/format-message');
const slackDelayedReply = require('./slack/delayed-reply');

let logError = function (err) {
  console.error(err);
};

module.exports = function botBuilder(messageHandler, optionalLogError) {
  logError = optionalLogError || logError;

  const api = new ApiBuilder(),
    messageHandlerPromise = function (message, originalApiBuilderRequest) {
      return Promise.resolve(message).then(message => messageHandler(message, originalApiBuilderRequest));
    };

  api.get('/', () => 'Ok');

  fbSetup(api, messageHandlerPromise, logError);
  slackSetup(api, messageHandlerPromise, logError);
  telegramSetup(api, messageHandlerPromise, logError);
  skypeSetup(api, messageHandlerPromise, logError);

  return api;
};

module.exports.fbTemplate = fbTemplate;
module.exports.slackTemplate = slackTemplate;
module.exports.slackDelayedReply = slackDelayedReply;
