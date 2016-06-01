'use strict';

module.exports = function(messageObject) {
  return {
    sender: messageObject.from,
    text: messageObject.text,
    originalRequest: messageObject.reply_to_message,
    type: 'telegram'
  }
};
