'use strict';
const qs = require('querystring');

// Get URLs to attached media in MMS.
function createMediaArray(messageObject) {
  return Object.keys(messageObject)
    .filter(function (key) {
      return key.match(/^MediaUrl/);
    })
    .map(function (key) {
      return messageObject[key];
    });
}

module.exports = function(messageObject) {
  messageObject = qs.parse(messageObject);
  console.log('TWILIO PARSE RECEIVED MESSAGE:', messageObject);
  if (!messageObject) return;
  var hasBody = typeof messageObject.Body !== 'undefined'
    && messageObject.Body.length > 0;
  var hasSender = typeof messageObject.From !== 'undefined'
    && messageObject.From.length > 0;
  var hasMedia = parseInt(messageObject.NumMedia || 0);
  if (hasSender && (hasBody || hasMedia)) {
    var o = {
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
