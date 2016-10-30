'use strict';

module.exports = function(messageObject, botId) {

  if (messageObject && messageObject.text !== undefined && messageObject.sender_id != botId){
    return {
      sender: messageObject.group_id,
      text: messageObject.text,
      originalRequest: messageObject,
      type: 'groupme'
    };
  }
};
