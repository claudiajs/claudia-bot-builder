'use strict';

const rp = require('minimal-request-promise');
const formatReply = require('./reply');

module.exports = function slackDelayedReply(message, response) {
  if (!message || !message.originalRequest || !message.originalRequest.response_url || !response)
    throw new Error('Original bot request and response are required');

  return rp.post(message.originalRequest.response_url, {
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formatReply(response))
  });
};
