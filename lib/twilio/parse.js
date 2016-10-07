'use strict';

module.exports = function(messageObject) {

  console.log(JSON.stringify(messageObject))
  console.log(messageObject)
  if (messageObject && typeof messageObject.Body !== 'undefined')
    console.log("we're inside now")
    return {
      sender: messageObject.From,
      text: messageObject.Body,
      originalRequest: messageObject,
      type: 'twilio'
    };
};
