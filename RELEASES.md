# Claudia Bot Builder release history

## 2.4.0, 30 October 2016

- add GroupMe support

## 2.3.0, 28 October 2016

- add Kik support

## 2.2.0, 27 October 2016

- allow Skype bot to reply in the group conversation

## 2.1.0, 17 October 2016

- add Twilio support
- add Telegram template builder
- update Facebook template builder with TitleCase methods and add deprecation note for camelCase method names

## 2.0.0, 27 September 2016

- upgrading to use claudia-api-builder 2.0.0
- requires using claudia 2.x to deploy

## 1.4.5, 24 September 2016

- add support for Telegram custom messages, more info [here](https://github.com/claudiajs/claudia-bot-builder/blob/master/docs/TELEGRAM_CUSTOM_MESSAGES.md)

## 1.4.4, 3 September 2016

- upgrade Skype bot to v3 API
- temporary remove FB security because of the problem with unicode with attachments

## 1.4.3, 26 August 2016

- update a message for Facebook Messenger deprecation notice for non-validated requests

## 1.4.2, 25 August 2016

- add Facebook Messenger payload verification
- add Facebook Messenger deprecation notice for non-validated requests
- add GET endpoint for Slack SSL checks

## 1.4.1, 4 August 2016

- using Claudia API Builder 1.5.1, should improve performance for bots connecting to third party services.

## 1.4.0, 14 July 2016

- add support for Slack delayed reply

## 1.3.3, 11 July 2016

- fix FB Messenger receipt template

## 1.3.2, 10 July 2016

- do not parse FB Messenger message echoes, delivery and read reports

## 1.3.1, 3 July 2016

- fix video thumbnail on npmjs.org
- add colors for console setup

## 1.3.0, 2 July 2016

- add Slack message builder
- add support for Telegram inline messages
- add support for Facebook Messenger quick reply
- add support for longer top level domain names

## 1.2.0, 25 June 2016

- add support for Slack message actions
- parse Facebook Messenger's attachments
- pass original API request object to bot builder
- parse Slack message without text

## 1.1.0, 19 June 2016

- separate Slack App slash command and slash command integration configuration
- add Facebook message builder for structured messages
- allow Facebook reply method to send multiple messages as an array

## 1.0.0, 13 June 2016

- initial release with support for Facebook Messenger, Slack slash commands, Telegram and Skype
