'use strict';

const rp = require('minimal-request-promise');
const REQUEST_THROTTLE = 1000/30;
const RETRIABLE_ERRORS = ['ECONNRESET', 'ENOTFOUND', 'ESOCKETTIMEDOUT', 'ETIMEDOUT', 'ECONNREFUSED', 'EHOSTUNREACH', 'EPIPE', 'EAI_AGAIN'];
const NUMBER_OF_RETRIES = 20;

module.exports = function tlReply(messageObject, message, tlAccessToken) {

  var sendHttpRequest = function sendApiRequest(tlAccessToken, method, options, numberOfRetries) {
      return rp.post(`https://api.telegram.org/bot${tlAccessToken}/${method}`, options)
        .catch(e => {
          let httpCode = parseInt(e.statusCode, 10);
          if (numberOfRetries-- > 0 && (RETRIABLE_ERRORS.indexOf(e.statusMessage) >= 0 || httpCode == 429 || httpCode == 420 || httpCode >= 500 && httpCode < 600)) {
            return sendHttpRequest(tlAccessToken, method, options, numberOfRetries);
          }
          throw e;
        });
    },
    sendSingle = function sendSingle (message) {
      var method, body;

      if (typeof message === 'object' && typeof message.claudiaPause === 'number') {
        return new Promise(resolve => setTimeout(resolve, parseInt(message.claudiaPause, 10)));
      } else if (typeof message !== 'string') {
        method = message.method ? message.method : messageObject.originalRequest.inline_query ?
          'answerInlineQuery' : 'sendMessage';
        body = message.body ? message.body : message;
        if (!body.chat_id)
          body.chat_id = messageObject.sender;
      } else if (messageObject.originalRequest.inline_query && typeof message === 'string') {
        method = 'answerInlineQuery';
        body = {
          inline_query_id: messageObject.sender,
          results: [{
            type: 'article',
            id: `${new Date().getTime()}`,
            title: messageObject.text,
            input_message_content: {
              message_text: messageObject.text
            }
          }]
        };
      } else {
        method = 'sendMessage';
        body = {
          chat_id: messageObject.sender,
          text: message
        };
      }

      let numberOfRetries = NUMBER_OF_RETRIES;

      const options = {
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      };

      return sendHttpRequest(tlAccessToken, method, options, numberOfRetries);
    },

    sendAll = function () {
      if (!messages.length) {
        return Promise.resolve();
      } else {
        return sendSingle(messages.shift())
        .then(() => {
          return new Promise((resolve) => {
            if (!messages.length)
              resolve();
            else
              setTimeout(resolve, REQUEST_THROTTLE);
          });
        })
        .then(sendAll);
      }
    },

    messages = Array.isArray(message) ? message : [message];

  return sendAll();
};
