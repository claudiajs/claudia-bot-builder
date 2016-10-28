'use strict';

module.exports = function(messageObject) {

  if (messageObject && messageObject.type == 'text' && messageObject.chatId){
    return {
      sender: messageObject.from,
      text: messageObject.body,
      chatId: messageObject.chatId,
      kikType: messageObject.type,
      originalRequest: messageObject,
      type: 'kik'
    };
  }
};
