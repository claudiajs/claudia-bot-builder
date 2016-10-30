'use strict';

module.exports = function(messageObject) {
  if (messageObject && messageObject.text !== undefined &&
    messageObject.group_id !== undefined && messageObject.sender_type !== 'bot'){
    return {
      sender: messageObject.group_id,
      text: messageObject.text,
      originalRequest: messageObject,
      type: 'groupme'
    };
  }
};
