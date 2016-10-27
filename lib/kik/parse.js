'use strict';

module.exports = function(messageObject) {

  if (messageObject && messageObject.type == 'text' && messageObject.chatId){
    return {
      sender: messageObject.from,
      text: messageObject.body,
      originalRequest: messageObject,
      type: 'kik'
    };
  }
};
