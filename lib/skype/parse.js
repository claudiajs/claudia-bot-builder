'use strict';

module.exports = function(messageObject, contextId) {

  if (typeof messageObject.content !== 'undefined')
    return {
      sender: messageObject.from,
      text: messageObject.content,
      originalRequest: messageObject.id,
      contextId: contextId,
      type: 'skype'
    };
};
