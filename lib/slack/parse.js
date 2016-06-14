'use strict';

module.exports = function(messageObject) {
  if (messageObject && messageObject.user_id && messageObject.text)
    return {
      sender: messageObject.user_id,
      text: messageObject.text,
      originalRequest: messageObject,
      type: 'slack-slash-command'
    };
};
