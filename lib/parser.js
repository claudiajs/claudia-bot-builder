'use strict'

module.exports = {
  fb(messageObject) {
    console.log('>>>', messageObject)

    if (typeof messageObject.message === 'object' && typeof messageObject.message.text !== 'undefined')
      return {
        sender: messageObject.sender.id,
        text: messageObject.message.text,
        originalRequest: messageObject,
        type: 'facebook'
      }
  },

  slackSlashCommand(messageObject) {
    /*token=gIkuvaNzQIHg97ATvDxqgjtO
    team_id=T0001
    team_domain=example
    channel_id=C2147483705
    channel_name=test
    user_id=U2147483697
    user_name=Steve
    command=/weather
    text=94070
    response_url=https://hooks.slack.com/commands/1234/5678
    */
    return {
      sender: messageObject.user_id,
      text: messageObject.text,
      originalRequest: messageObject,
      type: 'slack-slash-command'
    }
  }
}
