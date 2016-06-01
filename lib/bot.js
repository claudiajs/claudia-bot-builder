'use strict'

module.exports = function(request) {
  /*
    {
      sender: '',
      text: '',
      originalRequest: {},
      type: '' // facebook, slackSlashCommand, slackBot
    }
  */

  return Promise.resolve(request.text)
}
