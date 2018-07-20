'use strict';

const setup = require('./setup');
const reply = require('./reply');
const parse = require('./parse');
const SlackTemplate = require('./format-message');
const delayedReply = require('./delayed-reply');

class SlackPlatform {
  constructor(options) {
    this.options = options || {};

    this.export = {
      SlackTemplate: SlackTemplate,
      delayedReply: this.delayedReply
    };
  }

  setup(api, bot, logError, optionalParser, optionalResponder) {
    const setupFunction = setup.bind(this);
    return setupFunction(api, bot, logError, optionalParser, optionalResponder);
  }

  reply(botResponse) {
    const replyFunction = reply.bind(this);
    return replyFunction(botResponse);
  }

  parse(messageObject) {
    const parseFunction = parse.bind(this);
    return parseFunction(messageObject);
  }

  delayedReply(message, response) {
    const delayedReplyFunction = delayedReply.bind(this);
    return delayedReplyFunction(message, response);
  }
}

module.exports = SlackPlatform;
