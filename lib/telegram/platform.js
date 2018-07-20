'use strict';

const setup = require('./setup');
const reply = require('./reply');
const parse = require('./parse');
const template = require('./format-message');

class TelegramPlatform {
  constructor(options) {
    this.options = options || {};

    this.export = {
      telegramReply: this.reply,
      telegramTemplate: this.template
    };
  }

  setup(api, bot, logError, optionalParser, optionalResponder) {
    const setupFunction = setup.bind(this);
    return setupFunction(api, bot, logError, optionalParser, optionalResponder);
  }

  reply(messageObject, message, tlAccessToken) {
    const replyFunction = reply.bind(this);
    return replyFunction(messageObject, message, tlAccessToken);
  }

  parse(messageObject) {
    const parseFunction = parse.bind(this);
    return parseFunction(messageObject);
  }

  template() {
    return template;
  }
}

module.exports = TelegramPlatform;
