'use strict';

module.exports = function slackReply(botResponse) {
  if (typeof botResponse === 'string')
    return {
      text: botResponse
    };

  return botResponse;
};
