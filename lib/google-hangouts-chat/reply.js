'use strict';

module.exports = function googleHangoutsReply(botResponse) {
  if (typeof botResponse === 'string') {
    return {
      text: botResponse
    };
  }

  return botResponse;
};
