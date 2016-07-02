'use strict';

module.exports = function(messageObject) {

  if (messageObject && messageObject.inline_query && messageObject.inline_query.id){
    var inlineQuery = messageObject.inline_query;
    return {
      sender: inlineQuery.id,
      text: inlineQuery.query,
      originalRequest: messageObject,
      type: 'telegram'
    };
  }

  if (messageObject && messageObject.message && messageObject.message.chat && messageObject.message.chat.id ){
    var message = messageObject.message;
    return {
      sender: message.chat.id,
      text: message.text || '',
      originalRequest: messageObject,
      type: 'telegram'
    };
  }
};
