'use strict';

module.exports = function googleHangoutsParse(messageObject) {
  if (!messageObject || !messageObject.type) return;

  const message = messageObject.message;

  const text = message && message.text ? message.text : '';

  let messageType = 'unknown';
  switch (messageObject.type) {
  case 'MESSAGE':
    messageType = 'message';
    break;
  case 'ADDED_TO_SPACE':
    messageType = 'add-command';
    break;
  case 'REMOVED_FROM_SPACE':
    messageType = 'remove-command';
    break;
  }

  const sender = messageType === 'message' ?
    message && message.sender && message.sender.name :
    (messageObject.user && messageObject.user.name || 'no sender');

  return {
    sender: sender,
    text: text,
    originalRequest: messageObject,
    type: `google-hangouts-chat-${messageType}`
  };
};
