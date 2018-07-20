'use strict';

const setup = require('./setup');
const reply = require('./reply');
const parse = require('./parse');
const template = require('./format-message');

class SkypePlatform {
  constructor(options) {
    this.options = options || {};

    this.export = {
      skypeReply: this.reply,
      skypeTemplate: this.template
    };
  }

  setup(api, bot, logError, optionalParser, optionalResponder) {
    const setupFunction = setup.bind(this);
    return setupFunction(api, bot, logError, optionalParser, optionalResponder);
  }

  reply(conversationId, message, contextId, authToken) {
    const replyFunction = reply.bind(this);
    return replyFunction(conversationId, message, contextId, authToken);
  }

  parse(messageObject, contextId) {
    const parseFunction = parse.bind(this);
    return parseFunction(messageObject, contextId);
  }

  template() {
    return template;
  }
}

module.exports = SkypePlatform;
