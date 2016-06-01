'use strict';

module.exports = function(messageObject) {
  if (typeof messageObject.text !== 'undefined')
  return {
    sender: messageObject.chat.id,
    text: messageObject.text,
    originalRequest: messageObject.chat.id,
    type: 'telegram'
  }
};
