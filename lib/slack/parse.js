'use strict'

module.exports = function(messageObject) {
  return {
    sender: messageObject.user_id,
    text: messageObject.text,
    originalRequest: messageObject,
    type: 'slack-slash-command'
  }
}
