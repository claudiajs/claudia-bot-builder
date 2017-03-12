'use strict';

const setup = require('./setup');
const reply = require('./reply');
const parse = require('./parse');

class TwilioPlatform {
  constructor(options) {
    this.options = options || {};

    this.export = {
      twilioReply: this.reply
    };
  }

  setup(api, bot, logError, optionalParser, optionalResponder) {
    const setupFunction = setup.bind(this);
    return setupFunction(api, bot, logError, optionalParser, optionalResponder);
  }

  reply(twilioAccountSid, twilioAuthToken, twilioSendingNumber, toNumber, message) {
    const replyFunction = reply.bind(this);
    return replyFunction(twilioAccountSid, twilioAuthToken, twilioSendingNumber, toNumber, message);
  }

  parse(messageObject) {
    const parseFunction = parse.bind(this);
    return parseFunction(messageObject);
  }
}

module.exports = TwilioPlatform;
