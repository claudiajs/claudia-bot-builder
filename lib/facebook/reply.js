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
    sendAll = function () {
      if (!messages.length) {
        return Promise.resolve();
      } else {
        return sendSingle(messages.shift()).then(sendAll);
      }
    },
    messages = [];

  function breakTextAndReturnFormatted(message) {
    return breakText(message, 320).map(m => ({ text: m }));
  }

  if (typeof message === 'string') {
    messages = breakTextAndReturnFormatted(message);
  } else if (Array.isArray(message)) {
    message.forEach(msg => {
      if (typeof msg === 'string') {
        messages = messages.concat(breakTextAndReturnFormatted(msg));
      } else {
        messages.push(msg);
      }
    });
  } else {
    messages = [message];
  }
  return sendAll();
};
