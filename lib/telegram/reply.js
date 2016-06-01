'use strict';

const rp = require('minimal-request-promise');

module.exports = function tlReply(recipient, message, tlAccessToken) {
  if (typeof message === 'string')
    message = {
      text: message
    };

  const options = {
    method: 'POST',
    hostname: 'api.telegram.org',
    path: `/bot${tlAccessToken}/sendMessage`,
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

  return rp(options)
};
