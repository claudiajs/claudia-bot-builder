'use strict';

module.exports = function(messageObject, contextId) {

  if (messageObject && typeof messageObject.text !== 'undefined')
    return {
      sender: messageObject.conversation.id,
      text: messageObject.text,
      originalRequest: messageObject,
      contextId: contextId,
      type: 'skype'
    };
};
