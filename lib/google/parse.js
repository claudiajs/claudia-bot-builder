'use strict';

module.exports = function googleParse(assistant, request) {
  if (assistant) {
    return {
      sender: assistant.getUser().userId,
      text: assistant.getRawInput(),
      originalRequest: request,
      type: 'google-action',
      accessToken: assistant.getUser().accessToken
    };
  }
};
