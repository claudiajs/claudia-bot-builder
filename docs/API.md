# Claudia Bot Builder API

The Claudia Bot Builder is based on a simple callback API. Whenever a message is received by an endpoint, the Bot Builder will parse the message and pass it on to your callback. Register the endpoint by executing the `claudia-bot-builder` function and export the result from your module.

```javascript
const botBuilder = require('claudia-bot-builder');

module.exports = botBuilder(function (message, request) {
  return `I got ${request.text}`;
});
```

The first argument is the message object, as explained below.

The second argument (since version `1.2.0`) is the [Claudia API Builder](https://github.com/claudiajs/claudia-api-builder/blob/master/docs/api.md#the-request-object) request object, with all the details of the HTTP request and Lambda context.

## Message object structure

The message object contains the following fields

* `text`: `string` the text of the message received, extracted from a bot-specific format. In most cases, if you just want to reply to text messages, this is the only piece of information you'll need.
* `type`: `string` the type of the end-point receiving the message. It can be `facebook`, `slack-slash-command`, `skype` or `telegram`
* `originalRequest`: `object` the complete original message, in a bot-specific format, useful if you want to do more than just reply to text messages.
* `sender`: `string` the identifier of the sender
* `postback`: `boolean` true if the message is the result of a post-back (for example clicking on a button created by a previous message in Facebook). It will be `undefined` (falsy) for completely new messages.

_Note_: FB Messenger message echoes, delivery and read reports will not be parsed.

## Reply formats

If you reply with a string, the response will be packaged in a bot-specific format representing a simple text message. _Claudia Bot Builder_ helps in that way to handle generic simple text responses easily.

Individual bots support more complex responses, such as buttons, attachments and so on. You can send all those responses by replying with an object, instead of a string. In that case, _Claudia Bot Builder_ does not transform the response at all, and just passes it back to the sender. It's then your responsibility to ensure that the resulting object is in the correct format for the bot engine. Use `request.type` to discover the bot engine sending the requests.

If you reply with an array multiple messages will be sent in sequence. Each array item can be text or already formatted object and it'll follow the same rules explained above. At the moment, this is supported for Facebook Messenger only.

Additionally, _Claudia Bot Builder_ exports message generators for for generating more complex responses including buttons and attachments for Facebook and Slack and function for sending delayed/multiple replies.

For the details see:

- [Facebook Template Message builder documentation](FB_TEMPLATE_MESSAGE_BUILDER.md)
- [Slack Message builder documentation](SLACK_MESSAGE_MESSAGE_BUILDER.md)
- [Slack Delayed reply documentation](SLACK_DELAYED_REPLY_BUILDER.md)

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
* For Telegram, use `--configure-telegram-bot`

You need to do this only once per version. If you create different versions for development, testing and production, remember to configure the bots.
