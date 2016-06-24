'use strict';

module.exports = function slackReply(botResponse) {
  console.log('Slack response', botResponse);
  if (typeof botResponse === 'string')
    return {
      text: botResponse
    };

  return botResponse;
};
