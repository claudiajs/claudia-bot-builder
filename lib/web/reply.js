'use strict';

module.exports = function webReply(botResponse) {
  if (typeof botResponse === 'string')
    return {
      text: botResponse
    };

  return botResponse;
};
