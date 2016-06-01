'use strict'

module.exports = {
  fb(messageObject) {
    return {
      sender: messageObject.sender.id,
      text: messageObject.message.text,
      originalRequest: messageObject,
      type: 'facebook'
    }    
  }
}
