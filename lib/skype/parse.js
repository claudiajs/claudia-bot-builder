'use strict';

module.exports = function(messageObject, contextId) {

  if (messageObject && typeof messageObject.content !== 'undefined')
    return {
      sender: messageObject.from,
      text: messageObject.content,
      originalRequest: messageObject.id,
      contextId: contextId,
      type: 'skype'
    };
};
