'use strict';

const botBuilder = require('./lib/bot-builder.js');
const excuse = require('huh');

module.exports = botBuilder(function (request) {
  /*
    {
      sender: '',
      text: '',
      originalRequest: {},
      type: '' // facebook, slackSlashCommand, slackBot, telegram
    }
  */
  return Promise.resolve(`Why ${request.text} > ${excuse.get()}`);
});
