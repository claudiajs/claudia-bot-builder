'use strict';
const qs = require('querystring');

module.exports = function(messageObject) {
  messageObject = qs.parse(messageObject);
  console.log('TWILIO PARSE RECEIVED MESSAGE:', messageObject);
  if (messageObject && typeof messageObject.Body !== 'undefined' && messageObject.Body.length > 0 &&
    typeof messageObject.From !== 'undefined' && messageObject.From.length > 0){
    return {
      sender: messageObject.From,
      text: messageObject.Body,
      originalRequest: messageObject,
      type: 'twilio'
    };
  }
};
