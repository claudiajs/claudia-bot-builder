'use strict';

const rp = require('minimal-request-promise'),
  breakText = require('../breaktext');

module.exports = function fbReply(recipient, message, fbAccessToken) {
  var sendSingle = function sendSingle (message) {
      const options = {
        method: 'POST',
        hostname: 'graph.facebook.com',
        path: `/v2.6/me/messages?access_token=${fbAccessToken}`,
        port: 443,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipient: {
            id: recipient
          },
          message: message
        })
      };
      return rp(options);
    },
    messages;

  if (typeof message === 'string') {
    messages = breakText(message, 320).map(m => ({ text: m }));
  } else {
    messages = [message];
  }
  return Promise.all(messages.map(sendSingle));
};
