'use strict';

module.exports = function alexaReply(botResponse, botName) {
  if (typeof botResponse === 'string' && botName)
    return {
      response: {
        outputSpeech: {
          type: 'PlainText',
          text: botResponse
        },
        card: {
          type: 'Simple',
          title: botName || '',
          content: botResponse
        },
        shouldEndSession: true
      }
    };

  return botResponse;
};
