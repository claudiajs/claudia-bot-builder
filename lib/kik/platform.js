'use strict';

const setup = require('./setup');
const reply = require('./reply');
const parse = require('./parse');

class KikPlatform {
  constructor(options) {
    this.options = options || {};

    this.export = {
      kikReply: this.reply
    };
  }

  setup(api, bot, logError, optionalParser, optionalResponder) {
    const setupFunction = setup.bind(this);
    return setupFunction(api, bot, logError, optionalParser, optionalResponder);
  }

  reply(messageObject, message, username, kikApiKey) {
    const replyFunction = reply.bind(this);
    return replyFunction(messageObject, message, username, kikApiKey);
  }

  parse(messageObject) {
    const parseFunction = parse.bind(this);
    return parseFunction(messageObject);
  }
}

module.exports = KikPlatform;
