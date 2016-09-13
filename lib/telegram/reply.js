'use strict';

const rp = require('minimal-request-promise');

module.exports = function tlReply(messageObject, message, tlAccessToken) {

  /*response from bot
  message = {
    method: 'sendMessage',
    ...optionalKeys
  }
  */

  var method, body;
  if (typeof message === 'string') {
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

  } else {
    method = message.method;
    body = {};
    Object.keys(message).forEach(key => {
      if (key === 'method') return;
      body[key] = message[key];
    });
  }

  const options = {
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };

  return rp.post(`https://api.telegram.org/bot${tlAccessToken}/${method}`, options);
};
