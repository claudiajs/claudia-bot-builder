'use strict';

const rp = require('minimal-request-promise');

module.exports = function fbReply(recipient, message, fbAccessToken) {
  if (typeof message === 'string')
    message = {
      text: message
    };

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
};
