'use strict'

module.exports = {
  fb(messageObject) {
    console.log('>>>', messageObject)

    if (typeof messageObject.message === 'object' && typeof messageObject.message.text !== 'undefined')
      return {
        sender: messageObject.sender.id,
        text: messageObject.message.text,
        originalRequest: messageObject,
        type: 'facebook'
      }
  }
}
