'use strict';

module.exports = function(messageObject) {
  if (messageObject && messageObject.chat && messageObject.chat.id && typeof messageObject.text !== 'undefined')
    return {
      sender: messageObject.chat.id,
      text: messageObject.text,
      originalRequest: messageObject.chat.id,
      type: 'telegram'
    };
};
