'use strict';
const rp = require('minimal-request-promise');

function kikReply(messageObject, message, username, kikApiKey) {
  var data = { messages: [{
    body: typeof message === 'string' ?  message : message.text,
    to: messageObject.sender,
    type: messageObject.kikType,
    chatId: messageObject.chatId
  }]};
  
  const options = {
    headers: {
      'Authorization': `Basic ${new Buffer(username + ':' + kikApiKey).toString('base64')}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify(data)
  };

  return rp.post('https://api.kik.com/v1/message', options);
}

module.exports = kikReply;