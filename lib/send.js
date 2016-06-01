'use strict'

const request = require('minimal-request-promise')

function send(recipientId, message, notificationType, token) {
  // const sendApiUrl = `https://graph.facebook.com/v2.6/me/messages?access_token=${token}`

  const options = {
    method: 'POST',
    hostname: 'graph.facebook.com',
    path: `/v2.6/me/messages?access_token=${token}`,
    port: 443,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      recipient: {
        id: recipientId
      },
      message: message
    })
  }

  return request(options)
}

function sendTextMessage(recipient, messageText, fbAccessToken) {
  return send(recipient, {
    text: messageText
  }, 'REGULAR', fbAccessToken)
}

function sendGenericTemplateMessage(recipient, elements) {
  // TODO: [@slobodan] add validation
  /*
    Each element needs to be an object with following structure:

    ```
    {
      title: '',     // String, required, bubble title
      item_url: '',  // String, optional, URL that is opened when bubble is tapped
      image_url: '', // String, optional, bubble image
      subtitle: '',  // String, optional, bubble subtitle
      buttons: [     // Array, optional, action buttons, up to 3 of them
        type: '',    // String, required, 'web_url' or 'postback'
        title: '',   // String, required, button title
        url: '',     // String, required for 'url' type
        payload: ''  // String, required for postback 'type', this data will be sent back to you via webhook
      ]
    }
    ```
  */
  const content = {
    template_type: 'generic',
    elements: elements
  }

  return send(recipient, {
    attachment: {
      type: 'template',
      payload: content
    }
  })
}

function sendButtonTemplateMessage() {}

function sendReceiptTemplateMessage() {}

module.exports = {
  message(recipient, message) {
    const payload = {
      text: message
    }

    return send(recipient, payload)
  },

  text: sendTextMessage,
  genericTemplate: sendGenericTemplateMessage,
  buttonTemplate: sendButtonTemplateMessage,
  receiptTemplate: sendReceiptTemplateMessage
}

