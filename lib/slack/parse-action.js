'use strict';

module.exports = function(actionObject) {
  if (actionObject && actionObject.actions)
    return {
      sender: actionObject.user,
      text: '',
      originalRequest: actionObject,
      type: 'slack-message-action'
    };
};
