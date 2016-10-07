'use strict';
const querystring = require('querystring')

module.exports = function(messageObject) {

  messageObject = querystring.parse(messageObject);
  if (messageObject && typeof messageObject.Body !== 'undefined'){
    return {
      sender: messageObject.From,
      text: messageObject.Body,
      originalRequest: messageObject,
      type: 'twilio'
    };
  }
};
