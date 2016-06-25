'use strict';

module.exports = function(messageObject) {
  if (messageObject && messageObject.user_id)
    return {
      sender: messageObject.user_id,
      text: messageObject.text || '',
      originalRequest: messageObject,
      type: 'slack-slash-command'
    };

  if (messageObject && messageObject.user && messageObject.actions)
    return {
      sender: messageObject.user.id,
      text: '',
      originalRequest: messageObject,
      type: 'slack-message-action',
      postback: true
    };
};
