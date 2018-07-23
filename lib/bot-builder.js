'use strict';

const ApiBuilder = require('claudia-api-builder');
const fbSetup = require('./facebook/setup');
const slackSetup = require('./slack/setup');
const telegramSetup = require('./telegram/setup');
const skypeSetup = require('./skype/setup');
const twilioSetup = require('./twilio/setup');
const kikSetup = require('./kik/setup');
const groupmeSetup = require('./groupme/setup');
const lineSetup = require('./line/setup');
const viberSetup = require('./viber/setup');
const alexaSetup = require('./alexa/setup');
const fbTemplate = require('./facebook/format-message');
const slackTemplate = require('./slack/format-message');
const slackDialog = require('./slack/format-dialog');
const telegramTemplate = require('./telegram/format-message');
const viberTemplate = require('./viber/format-message');
const skypeTemplate = require('./skype/format-message');
const AlexaTemplate = require('alexa-message-builder');
const slackDelayedReply = require('./slack/delayed-reply');

let logError = function (err) {
  console.error(err);
};

module.exports = function botBuilder(messageHandler, options, optionalLogError) {
  logError = optionalLogError || logError;

  const api = new ApiBuilder(),
    messageHandlerPromise = function (message, originalApiBuilderRequest) {
      return Promise.resolve(message).then(message => messageHandler(message, originalApiBuilderRequest));
    };

  api.get('/', () => 'Ok');

  let isEnabled = function isEnabled(platform) {
    return !options || !options.platforms || options.platforms.indexOf(platform) > -1;
  };

  if (isEnabled('facebook')) {
    fbSetup(api, messageHandlerPromise, logError);
  }
  if (isEnabled('slackSlashCommand')) {
    slackSetup(api, messageHandlerPromise, logError);
  }
  if (isEnabled('telegram')) {
    telegramSetup(api, messageHandlerPromise, logError);
  }
  if (isEnabled('skype')) {
    skypeSetup(api, messageHandlerPromise, logError);
  }
  if (isEnabled('twilio')) {
    twilioSetup(api, messageHandlerPromise, logError);
  }
  if (isEnabled('kik')) {
    kikSetup(api, messageHandlerPromise, logError);
  }
  if (isEnabled('groupme')) {
    groupmeSetup(api, messageHandlerPromise, logError);
  }
  if (isEnabled('line')) {
    lineSetup(api, messageHandlerPromise, logError);
  }
  if (isEnabled('viber')) {
    viberSetup(api, messageHandlerPromise, logError);
  }
  if (isEnabled('alexa')) {
    alexaSetup(api, messageHandlerPromise, logError);
  }

  return api;
};

module.exports.fbTemplate = fbTemplate;
module.exports.slackTemplate = slackTemplate;
module.exports.slackDialog = slackDialog;
module.exports.telegramTemplate = telegramTemplate;
module.exports.viberTemplate = viberTemplate;
module.exports.skypeTemplate = skypeTemplate;
module.exports.AlexaTemplate = AlexaTemplate;
module.exports.slackDelayedReply = slackDelayedReply;
