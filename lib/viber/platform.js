'use strict';

const setup = require('./setup');
const reply = require('./reply');
const parse = require('./parse');
const template = require('./format-message');

class ViberPlatform {
  constructor(options) {
    this.options = options || {};

    this.export = {
      viberReply: this.reply,
      viberTemplate: this.template
    };
  }

  setup(api, bot, logError, optionalParser, optionalResponder) {
    const setupFunction = setup.bind(this);
    return setupFunction(api, bot, logError, optionalParser, optionalResponder);
  }

  reply(receiver, authToken, messageObj) {
    return reply(receiver, authToken, messageObj);
  }

  parse(messageObject) {
    const parseFunction = parse.bind(this);
    return parseFunction(messageObject);
  }

  template() {
    return template;
  }
}

module.exports = ViberPlatform;
