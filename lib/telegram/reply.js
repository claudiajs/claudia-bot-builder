'use strict';

const rp = require('minimal-request-promise');

module.exports = function tlReply(messageObject, message, tlAccessToken) {

  var sendSingle = function sendSingle (message) {
    var method, body;

    if (typeof message !== 'string') {
      method = message.method ? message.method : messageObject.originalRequest.inline_query ?
        'inline_query' : 'sendMessage';
      body = message.body ? message.body : message;
      if (!body.chat_id)
        body.chat_id = messageObject.sender;
    } else if (messageObject.originalRequest.inline_query && typeof message === 'string') {
      method = 'answerInlineQuery';
      body = {
        inline_query_id: messageObject.sender,
        results: message
      };
    } else {
      method = 'sendMessage';
      body = {
        chat_id: messageObject.sender,
        text: message
      };
    }

    const options = {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };

    return rp.post(`https://api.telegram.org/bot${tlAccessToken}/${method}`, options);
  },
  sendAll = function () {
      if (!messages.length) {
        return Promise.resolve();
      } else {
        return sendSingle(messages.shift()).then(sendAll);
      }
    },

  messages = Array.isArray(message) ? message : [message];
  console.log('messages ->', JSON.stringify(messages));
  return sendAll();
};
