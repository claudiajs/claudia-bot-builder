'use strict';

const rp = require('minimal-request-promise');

module.exports = function tlReply(messageObject, message, tlAccessToken) {

  var method, body;

  if (messageObject.originalRequest.inline_query){
    method = 'answerInlineQuery';
    body = {
      inline_query_id: messageObject.sender,
      results: message
    };
  }

  if (messageObject.originalRequest.message) {
    method = 'sendMessage';
    body = {
      chat_id: messageObject.sender,
      text: message
    };
  }

  const options = {
    method: 'POST',
    hostname: 'api.telegram.org',
    path: `/bot${tlAccessToken}/${method}`,
    port: 443,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };

  return rp(options);
};
