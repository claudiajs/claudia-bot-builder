'use strict';

const setup = require('./setup');
const reply = require('./reply');
const parse = require('./parse');

class GroupmePlatform {
  constructor(options) {
    this.options = options || {};

    this.export = {
      groupmeReply: this.reply
    };
  }

  setup(api, bot, logError, optionalParser, optionalResponder) {
    const setupFunction = setup.bind(this);
    return setupFunction(api, bot, logError, optionalParser, optionalResponder);
  }

  reply(message, botId) {
    const replyFunction = reply.bind(this);
    return replyFunction(message, botId);
  }

  parse(messageObject) {
    const parseFunction = parse.bind(this);
    return parseFunction(messageObject);
  }
}

module.exports = GroupmePlatform;
