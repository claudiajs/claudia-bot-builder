'use strict';

module.exports = function(messageObject) {
  if (messageObject && messageObject.sender && messageObject.sender.id && messageObject.message && messageObject.message.text) {
    return {
      sender: messageObject.sender.id,
      text: messageObject.message.text,
      originalRequest: messageObject,
      type: 'facebook'
    };
  }
  else if (messageObject && messageObject.sender && messageObject.sender.id && messageObject.postback && messageObject.postback.payload) {
    return {
      sender: messageObject.sender.id,
      text: messageObject.postback.payload,
      originalRequest: messageObject,
      type: 'facebook',
      postback: true
    };
  }
};
