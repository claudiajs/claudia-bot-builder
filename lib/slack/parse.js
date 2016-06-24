'use strict';

module.exports = function(messageObject) {
  if (messageObject && messageObject.user_id)
    return {
      sender: messageObject.user_id,
      text: messageObject.text || '',
      originalRequest: messageObject,
      type: 'slack-slash-command'
    };

  if (messageObject && messageObject.actions)
    return {
      sender: messageObject.user,
      text: '',
      originalRequest: messageObject,
      type: 'slack-message-action'
    };
};
