'use strict';

module.exports = function(messageObject) {

  console.log(JSON.stringify(messageObject))
  if (messageObject && typeof messageObject.body !== 'undefined')
    return {
      sender: messageObject.from,
      text: messageObject.body,
      originalRequest: messageObject,
      type: 'twilio'
    };
};
