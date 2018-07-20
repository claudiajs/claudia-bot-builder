'use strict';

const setup = require('./setup');
const reply = require('./reply');
const parse = require('./parse');
const AlexaTemplate = require('alexa-message-builder');

class AlexaPlatform {
  constructor(options) {
    this.options = options || {};
    this.export = {
      AlexaTemplate: AlexaTemplate
    };
  }

  setup(api, bot, logError, optionalParser, optionalResponder) {
    const setupFunction = setup.bind(this);
    return setupFunction(api, bot, logError, optionalParser, optionalResponder);
  }

  reply(botResponse, botName) {
    const replyFunction = reply.bind(this);
    return replyFunction(botResponse, botName).bind(this);
  }

  parse(messageObject) {
    const parseFunction = parse.bind(this);
    return parseFunction(messageObject).bind(this);
  }
}

module.exports = AlexaPlatform;
