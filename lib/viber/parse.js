'use strict';

module.exports = function(messageObject) {

  if (messageObject && messageObject.message){
    return {
      sender: messageObject.sender.id,
      text: (typeof messageObject.message === 'object' && messageObject.message.type === 'text')  ? messageObject.message.text : '',
      originalRequest: messageObject,
      type: 'viber'
    };
  }
};
