# Claudia Bot Builder

[![Build Status](https://travis-ci.org/claudiajs/claudia-bot-builder.svg)](https://travis-ci.org/claudiajs/claudia-bot-builder)
[![Join the chat at https://gitter.im/claudiajs/claudia](https://badges.gitter.im/claudiajs/claudia.svg)](https://gitter.im/claudiajs/claudia?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

_Claudia Bot Builder_ helps developers create and deploy chat-bots for various platforms in minutes to AWS Lambda. It simplifies the messaging workflows, automatically sets up the correct web hooks, and guides you through configuration steps, so that you can focus on important business problems and not have to worry about infrastructure code.

Check out [this two minute video](https://vimeo.com/170647056) to see how you can create and deploy a bot quickly:

[![](https://claudiajs.github.io/claudiajs.com/assets/claudia-bot-builder-video.jpg)](https://vimeo.com/170647056)

Here's a simple example:

```javascript
const botBuilder = require('claudia-bot-builder');
const excuse = require('huh');

module.exports = botBuilder(function (request) {
  return 'Thanks for sending ' + request.text +
    'Your message is very important to us, but ' +
    excuse.get();
});
```

This code is enough to operate bots for all four supported platforms. Claudia Bot Builder automatically parses the incoming messages into a common format, so you can handle it easily. It also automatically packages the response into the correct message template for the requesting bot, so you do not have to worry about individual bot protocols.

## Supported platforms

* Facebook Messenger Follow the instructions from the [Facebook Messenger Getting Started](https://developers.facebook.com/docs/messenger-platform/quickstart) guide, then submit the app for [App Review](https://developers.facebook.com/docs/messenger-platform/app-review)
* Slack (slash commands for now). Follow the instructions from [Slack API Docs](https://api.slack.com/) to set up an app with a slash command, then [Create a Slack Button](https://api.slack.com/docs/slack-button) so people can add your app to their channels
* Skype
* Telegram

## Creating bots

Check out the [Getting Started](GETTING_STARTED.md) guide for information on how to set up a simple bot in minutes and [API Documentation](API.md) for detailed information on the API.

## Examples

See the [Chat-Bots section](https://github.com/claudiajs/example-projects#chat-bots) of the Claudia.js example projects list

## Contributing

Contributions are greatly appreciated. See the [Contributors' guide](CONTRIBUTING.md) for information on running and testing code.

## What's new since...?

See the [Release History](RELEASES.md)

## Authors

* [Gojko Adzic](https://github.com/gojko)
* [Alexander Simovic](https://github.com/simalexan)
* [Slobodan Stojanovic](https://github.com/stojanovic)

## License

MIT -- see [LICENSE](LICENSE)
