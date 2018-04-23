'use strict';

module.exports = function googleReply(botResponse, botName, assistant) {
  if (typeof botResponse === 'string') {
    assistant.tell(botResponse);
    return assistant.response_._getData();
  }
  return botResponse;
};
