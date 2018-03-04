'use strict';

module.exports = function(messageObject) {

  if (messageObject && messageObject.inline_query && messageObject.inline_query.id){
    var inlineQuery = messageObject.inline_query;
    return {
      sender: inlineQuery.from.id,
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

  if (messageObject && messageObject.callback_query && messageObject.callback_query.message.chat &&
    messageObject.callback_query.message.chat.id ){
    var callback_query = messageObject.callback_query;
    return {
      sender: callback_query.message.chat.id,
      text: callback_query.data || '',
      originalRequest: messageObject,
      type: 'telegram'
    };
  }

  if (messageObject && messageObject.channel_post && messageObject.channel_post.chat && messageObject.channel_post.chat.id ){
    var channelPost = messageObject.channel_post;
    return {
      sender: channelPost.chat.id,
      text: channelPost.text || '',
      originalRequest: messageObject,
      type: 'telegram'
    };
  }
};
