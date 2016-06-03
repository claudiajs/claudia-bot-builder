'use strict';

module.exports = function(messageObject, contextId) {

  if (messageObject.activity === 'contactRelationUpdate' && messageObject.action === 'add'){
    return {
      sender: messageObject.from,
      text: `Hello ${messageObject.fromDisplayName}`,
      type: 'skype'
    };
  }

  if (typeof messageObject.content !== 'undefined')
    return {
      sender: messageObject.from,
      text: messageObject.content,
      originalRequest: messageObject.id,
      contextId: contextId,
      type: 'skype'
    };
};
