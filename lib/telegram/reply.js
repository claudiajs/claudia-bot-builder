'use strict';

const rp = require('minimal-request-promise');

module.exports = function tlReply(chatId, message, tlAccessToken) {

  const options = {
    method: 'POST',
    hostname: 'api.telegram.org',
    path: `/bot${tlAccessToken}/sendMessage`,
    port: 443,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message
    })
  };

  return rp(options)
};
