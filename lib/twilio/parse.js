'use strict';
const qs = require('querystring');

// Get URLs to attached media in MMS.
function createMediaArray(messageObject) {
  const media = [];
  for (let i = 0; i < messageObject.NumMedia; i++) {
    media.push({
      contentType: messageObject[`MediaContentType${i}`],
      url: messageObject[`MediaUrl${i}`]
    });
  }
  return media;
}

module.exports = function(messageObject) {
  messageObject = qs.parse(messageObject);
  if (!messageObject) return;
  const hasBody = typeof messageObject.Body !== 'undefined'
    && messageObject.Body.length > 0;
  const hasSender = typeof messageObject.From !== 'undefined'
    && messageObject.From.length > 0;
  const hasMedia = parseInt(messageObject.NumMedia || 0);
  if (hasSender && (hasBody || hasMedia)) {
    const o = {
      sender: messageObject.From,
      text: messageObject.Body,
      originalRequest: messageObject,
      type: 'twilio'
    };
    if (hasMedia) {
      o.media = createMediaArray(messageObject);
    }
    return o;
  }
};
