'use strict';

const setup = require('./setup');
const reply = require('./reply');
const parse = require('./parse');

class LinePlatform {
  constructor(options) {
    this.options = options || {};

    this.export = {
      lineReply: this.reply
    };
  }

  setup(api, bot, logError, optionalParser, optionalResponder) {
    const setupFunction = setup.bind(this);
    return setupFunction(api, bot, logError, optionalParser, optionalResponder);
  }

  reply(replyToken, message, lineChannelAccessToken) {
    const replyFunction = reply.bind(this);
    return replyFunction(replyToken, message, lineChannelAccessToken);
  }

  parse(messageObject) {
    const parseFunction = parse.bind(this);
    return parseFunction(messageObject);
  }
}

module.exports = LinePlatform;
