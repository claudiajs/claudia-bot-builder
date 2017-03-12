'use strict';

const setup = require('./setup');
const reply = require('./reply');
const parse = require('./parse');
const template = require('./format-message');

class FacebookPlatform {
  constructor(options) {
    this.options = options || {};

    this.export = {
      fbReply: this.reply,
      fbTemplate: this.template
    };
  }

  setup(api, bot, logError, optionalParser, optionalResponder) {
    const setupFunction = setup.bind(this);
    return setupFunction(api, bot, logError, optionalParser, optionalResponder);
  }

  reply(recipient, message, fbAccessToken) {
    const replyFunction = reply.bind(this);
    return replyFunction(recipient, message, fbAccessToken);
  }

  parse(messageObject) {
    const parseFunction = parse.bind(this);
    return parseFunction(messageObject);
  }

  postDeploy() {
    if (typeof this.options.persistentMenu === 'function') {
      this.options.persistentMenu();
    }
  }

  template() {
    return template;
  }
}

module.exports = FacebookPlatform;
