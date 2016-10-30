'use strict';

const ApiBuilder = require('claudia-api-builder');
const fbSetup = require('./facebook/setup');
const slackSetup = require('./slack/setup');
const telegramSetup = require('./telegram/setup');
const skypeSetup = require('./skype/setup');
const twilioSetup = require('./twilio/setup');
const kikSetup = require('./kik/setup');
const groupmeSetup = require('./groupme/setup');
const fbTemplate = require('./facebook/format-message');
const slackTemplate = require('./slack/format-message');
const telegramTemplate = require('./telegram/format-message');
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
  twilioSetup(api, messageHandlerPromise, logError);
  kikSetup(api, messageHandlerPromise, logError);
  groupmeSetup(api, messageHandlerPromise, logError);

  return api;
};

module.exports.fbTemplate = fbTemplate;
module.exports.slackTemplate = slackTemplate;
module.exports.telegramTemplate = telegramTemplate;
module.exports.slackDelayedReply = slackDelayedReply;
