'use strict';
const rp = require('minimal-request-promise');

function sendSingle(receiver, authToken, messageObj) {
  let message;

  if (typeof messageObj === 'string') {
    message = {
      type: 'text',
      auth_token: authToken,
      text: messageObj,
      receiver: receiver
    };
  } else {
    message = messageObj;
    if (!message.auth_token)
      message.auth_token = authToken;
    if (!message.receiver)
      message.receiver = receiver;
  }
  const body = JSON.stringify(message);
  const options = {
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body, 'utf8')
    },
    body: body
  };

  return rp.post('https://chatapi.viber.com/pa/send_message', options);
}

function sendAll(receiver, authToken, messages) {
  if (!messages.length) {
    return Promise.resolve();
  } else {
    return sendSingle(receiver, authToken, messages.shift())
      .then(() => sendAll(receiver, authToken, messages));
  }
}

function sendReply(receiver, messages, authToken) {
  if (!Array.isArray(messages))
    messages = [messages];

  return sendAll(receiver, authToken, messages);
}

module.exports = sendReply;
