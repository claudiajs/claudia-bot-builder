'use strict';

function getSlotValues(slots) {
  if (!slots) return '';
  return Object.keys(slots).map(key => slots[key].value || '').join(' ');
}

module.exports = function alexaParse(messageObject) {
  if (messageObject && messageObject.request && messageObject.request.intent && messageObject.request.intent.name
    && messageObject.session && messageObject.session.user) {
    return {
      sender: messageObject.session.user.userId,
      text: getSlotValues(messageObject.request.intent.slots) || '',
      originalRequest: messageObject,
      type: 'alexa-skill'
    };
  }

  if (messageObject && messageObject.session && messageObject.session.user) {
    return {
      sender: messageObject.session.user.userId,
      text: '',
      originalRequest: messageObject,
      type: 'alexa-skill'
    };
  }
};
