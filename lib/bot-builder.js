'use strict';

const ApiBuilder = require('claudia-api-builder');
const AlexaPlatform = require('./alexa/platform');
const FacebookPlatform = require('./facebook/platform');
const GroupmePlatform = require('./groupme/platform');
const KikPlatform = require('./kik/platform');
const LinePlatform = require('./line/platform');
const SkypePlatform = require('./skype/platform');
const SlackPlatform = require('./slack/platform');
const TelegramPlatform = require('./telegram/platform');
const TwilioPlatform = require('./twilio/platform');
const ViberPlatform = require('./viber/platform');

const platforms = {
  alexa: new AlexaPlatform(),
  facebook: new FacebookPlatform(),
  groupme: new GroupmePlatform(),
  kik: new KikPlatform(),
  line: new LinePlatform(),
  skype: new SkypePlatform(),
  slackSlashCommand: new SlackPlatform(),
  telegram: new TelegramPlatform(),
  twilio: new TwilioPlatform(),
  viber: new ViberPlatform()
};

let logError = function (err) {
  console.error(err);
};

function enablePlatforms(platformProviders, api, messageHandlerPromise, logError) {
  platformProviders.forEach(platformProvider => {
    let platform = platformProvider;
    if (typeof platformProvider === 'string') {
      platform = platforms[platformProvider];
    }
    platform.setup(api, messageHandlerPromise, logError);
    Object.keys(platform.export).forEach(exportItem => {
      module.exports[exportItem] = platform.export[exportItem];
    });
  });
}

module.exports = function botBuilder(messageHandler, options, optionalLogError) {
  logError = optionalLogError || logError;

  const api = new ApiBuilder(),
    messageHandlerPromise = function (message, originalApiBuilderRequest) {
      return Promise.resolve(message).then(message => messageHandler(message, originalApiBuilderRequest));
    };

  api.get('/', () => 'Ok');

  if (options && Array.isArray(options.platforms)) {
    enablePlatforms(options.platforms, api, messageHandlerPromise, logError);
  } else {
    enablePlatforms(Object.keys(platforms), api, messageHandlerPromise, logError);
  }

  return api;
};

module.exports.AlexaPlatform = AlexaPlatform;
module.exports.FacebookPlatform = FacebookPlatform;
module.exports.GroupmePlatform = GroupmePlatform;
module.exports.KikPlatform = KikPlatform;
module.exports.LinePlatform = LinePlatform;
module.exports.SkypePlatform = SkypePlatform;
module.exports.SlackPlatform = SlackPlatform;
module.exports.TelegramPlatform = TelegramPlatform;
module.exports.TwilioPlatform = TwilioPlatform;
module.exports.ViberPlatform = ViberPlatform;
