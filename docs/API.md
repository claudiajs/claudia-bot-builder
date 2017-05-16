# Claudia Bot Builder API

The Claudia Bot Builder is based on a simple callback API. Whenever a message is received by an endpoint, the Bot Builder will parse the message and pass it on to your callback. Register the endpoint by executing the `claudia-bot-builder` function and export the result from your module.

```javascript
const botBuilder = require('claudia-bot-builder');

module.exports = botBuilder(function (message, originalApiRequest) {
  return `I got ${message.text}`;
});
```

The first argument is the message object, as explained below.

The second argument (since version `1.2.0`) is the [Claudia API Builder](https://github.com/claudiajs/claudia-api-builder/blob/master/docs/api.md#the-request-object) request object, with all the details of the HTTP request and Lambda context.

## Selecting platforms

By default, Bot Builder will set up endpoints for all supported platforms. This can slow down deployment unnecessarily if you only want to use one or two bot engines. Pass the second optional argument to the `botBuilder` function, and include a list of platform names into the `platforms` array key to limit the deployed platform APIs:

```javascript
const botBuilder = require('claudia-bot-builder');

module.exports = botBuilder(function (message, originalApiRequest) {
  return `I got ${message.text}`;
}, { platforms: ['facebook', 'twilio'] });
```

The list of platform names can include: `facebook`, `slackSlashCommand`, `telegram`, `skype`, `twilio`, `kik`, `groupme`, `viber`, `alexa`, `line`.

## Message object structure

The message object contains the following fields

* **`text`**: `string` the text of the message received, extracted from a bot-specific format. In most cases, if you just want to reply to text messages, this is the only piece of information you'll need.
* **`type`**: `string` the type of the end-point receiving the message. It can be `facebook`, `slack-slash-command`, `skype`, `telegram`, `twilio`, `alexa`, `viber`, `kik` or `groupme`
* **`originalRequest`**: `object` the complete original message, in a bot-specific format, useful if you want to do more than just reply to text messages.
* **`sender`**: `string` the identifier of the sender
* **`postback`**: `boolean` true if the message is the result of a post-back (for example clicking on a button created by a previous message in Facebook). It will be `undefined` (falsy) for completely new messages.

_Note_: FB Messenger message echoes, delivery and read reports will not be parsed.

## Message verification

_Claudia Bot Builder_ will verify message payload as recommended for each platform.

However, Facebook Messenger beside token validation offers additional security via `X-Hub-Signature` header, but it requires your Facebook App Secret.

This security step is also available in _Claudia Bot Builder_ but it is optional in current version. This will become mandatory in the next major version, so please run `claudia update` with `--configure-fb-bot` flag and set your Facebook App Secret on your next update or any time before the next major version.

You can read more about security check for Facebook Messenger in [Messenger's documentation](https://developers.facebook.com/docs/messenger-platform/webhook-reference#security).

## Reply formats

If you reply with a string, the response will be packaged in a bot-specific format representing a simple text message. _Claudia Bot Builder_ helps in that way to handle generic simple text responses easily.

Individual bots support more complex responses, such as buttons, attachments and so on. You can send all those responses by replying with an object, instead of a string. In that case, _Claudia Bot Builder_ does not transform the response at all, and just passes it back to the sender. It's then your responsibility to ensure that the resulting object is in the correct format for the bot engine. Use `request.type` to discover the bot engine sending the requests.

If you reply with an array multiple messages will be sent in sequence. Each array item can be text or already formatted object and it'll follow the same rules explained above. At the moment, this is supported for Facebook Messenger only.

Additionally, _Claudia Bot Builder_ exports message generators for for generating more complex responses including buttons and attachments for Facebook and Slack and function for sending delayed/multiple replies.

For the details see:

- [Facebook Template Message builder documentation](FB_TEMPLATE_MESSAGE_BUILDER.md)
- [Skype custom messages documentation](SKYPE_CUSTOM_MESSAGES.md)
- [Slack Message builder documentation](SLACK_MESSAGE_MESSAGE_BUILDER.md)
- [Slack Delayed reply documentation](SLACK_DELAYED_REPLY_BUILDER.md)
- [Telegram custom messages documentation](TELEGRAM_CUSTOM_MESSAGES.md)
- [Viber custom messages documentation](VIBER_CUSTOM_MESSAGES.md)
- [Alexa custom messages documentation](https://github.com/stojanovic/alexa-message-builder#documentation), external link, because Claudia Bot Builder is using [Alexa Message Builder module](https://www.npmjs.com/package/alexa-message-builder) for Alexa custom messages.

### Synchronous replies

Just return the result from the function.

### Asynchronous replies

Return a `Promise` from the callback function, and resolve the promise later with a string or object. The convention is the same as for synchronous replies.

If you plan to reply asynchronously, make sure to configure your lambda function so it does not get killed prematurely. By default, Lambda functions are only allowed to run for 3 seconds. See [update-function-configuration](http://docs.aws.amazon.com/cli/latest/reference/lambda/update-function-configuration.html) in the AWS Command Line tools for information on how to change the default timeout.

## Bot configuration

_Claudia Bot Builder_ automates most of the configuration tasks, and stores access keys and tokens into API Gateway stage variables. You can configure those interactively while executing `claudia create` or `claudia update` by passing an additional argument from the command line:

* For Facebook messenger bots, use `--configure-fb-bot`
* For Slack App slash commands, use `--configure-slack-slash-app`
* For Slack slash commands for your team, use `--configure-slack-slash-command`
* For Skype, use `--configure-skype-bot`
* For Viber, use `--configure-viber-bot`
* For Line, use `--configure-line-bot`
* For Telegram, use `--configure-telegram-bot`
* For Twilio, use `--configure-twilio-sms-bot`
* For Amazon Alexa, use `--configure-alexa-skill`
* For Kik, use `--configure-kik-bot`
* For GroupMe, use `--configure-groupme-bot`

You need to do this only once per version. If you create different versions for development, testing and production, remember to configure the bots.

An example tutorial for creating a bot with these you can find on [Claudia.js Hello World Chatbot](https://claudiajs.com/tutorials/hello-world-chatbot.html)
