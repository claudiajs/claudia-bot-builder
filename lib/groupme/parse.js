'use strict';

module.exports = function(messageObject) {

  if (messageObject && messageObject.text !== undefined){
    return {
      sender: messageObject.group_id,
      text: messageObject.text,
      originalRequest: messageObject,
      type: 'groupme'
    };
  }
};
