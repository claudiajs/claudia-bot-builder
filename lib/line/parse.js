'use strict';

module.exports = function(messageObject) {
  if (messageObject && messageObject.type && messageObject.replyToken &&
    messageObject.source && messageObject.source.userId){
    return {
      sender: messageObject.source.userId,
      replyToken: messageObject.replyToken,
      text: messageObject.type == 'message' ? messageObject.message.text : '',
      originalRequest: messageObject,
      type: 'line'
    };
  }
};
