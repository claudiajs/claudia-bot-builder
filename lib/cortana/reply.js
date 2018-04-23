'use strict';

module.exports = function cortanaReply(botResponse, session) {
  console.log('message to respond', botResponse);
  if (typeof botResponse === 'string') {
    session.endConversation(botResponse);
  } else if (Array.isArray(botResponse)) {
    for(let message of botResponse) {
      session.send(message);
    }
  } else {
    session.send(botResponse);
  }
};
