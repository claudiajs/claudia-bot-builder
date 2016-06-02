'use strict';

module.exports = function(messageObject, contextId) {

  console.log(messageObject);
  console.log(contextId);
  if (messageObject.activity === 'contactRelationUpdate' && messageObject.action === 'add'){
    return {
      skypeId: messageObject.from,
      text: `Hello ${messageObject.fromDisplayName}`,
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
