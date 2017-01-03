'use strict';

module.exports = function(messageObject) {
  if (messageObject && messageObject.sender && messageObject.sender.id && messageObject.message && messageObject.message.text && !messageObject.message.quick_reply &&
    (typeof messageObject.delivery !== 'object' && typeof messageObject.read !== 'object' && (!messageObject.message || !messageObject.message.is_echo))) { // Disable delivery and read reports and message echos
    return {
      sender: messageObject.sender.id,
      text: messageObject.message.text,
      originalRequest: messageObject,
      type: 'facebook'
    };
  }
  else if (messageObject && messageObject.sender && messageObject.sender.id && messageObject.postback && messageObject.postback.payload) {
    return {
      sender: messageObject.sender.id,
      text: messageObject.postback.payload,
      originalRequest: messageObject,
      postback: true,
      type: 'facebook'
    };
  }
  else if (messageObject && messageObject.sender && messageObject.sender.id && messageObject.message && messageObject.message.quick_reply && messageObject.message.quick_reply.payload) {
    return {
      sender: messageObject.sender.id,
      text: messageObject.message.quick_reply.payload,
      originalRequest: messageObject,
      postback: true,
      type: 'facebook'
    };
  }
  else if (messageObject && messageObject.sender && messageObject.sender.id &&
    (typeof messageObject.delivery !== 'object' && typeof messageObject.read !== 'object' && (!messageObject.message || !messageObject.message.is_echo))) { // Disable delivery and read reports and message echos
    return {
      sender: messageObject.sender.id,
      text: (messageObject.message && messageObject.message.text) ? messageObject.message.text : '',
      originalRequest: messageObject,
      type: 'facebook'
    };
  }
};
