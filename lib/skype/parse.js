'use strict';

module.exports = function(messageObject, contextId) {

  if (messageObject.activity === 'contactRelationUpdate' && messageObject.action === 'add'){
    return {
      skypeId: messageObject.from,
      text: `Hello ${messageObject.fromDisplayName}`,
      contextId: contextId,
      type: 'skype'
    }
  }
  
  if (typeof messageObject.content !== 'undefined')
    return {
      skypeId: messageObject.from,
      text: messageObject.content,
      originalRequest: messageObject.id,
      contextId: contextId,
      type: 'skype'
    }
};
