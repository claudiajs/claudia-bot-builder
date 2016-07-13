'use strict';

const rp = require('minimal-request-promise');
const formatReply = require('./reply');

module.exports = function slackDelayedReply(message, response) {
  return rp.post(message.originalRequest.response_url, {
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formatReply(response))
  });
};
