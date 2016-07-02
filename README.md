# Claudia Bot Builder

[![Build status](https://travis-ci.org/claudiajs/claudia-bot-builder.svg?v=1)](https://travis-ci.org/claudiajs/claudia-bot-builder) 
[![Join the chat at https://gitter.im/claudiajs/claudia](https://badges.gitter.im/claudiajs/claudia.svg)](https://gitter.im/claudiajs/claudia?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

_Claudia Bot Builder_ helps developers create and deploy chat-bots for various platforms in minutes to AWS Lambda. It simplifies the messaging workflows, automatically sets up the correct web hooks, and guides you through configuration steps, so that you can focus on important business problems and not have to worry about infrastructure code.

Check out [this two minute video](https://vimeo.com/170647056) to see how you can create and deploy a bot quickly:

[![](https://claudiajs.com/assets/claudia-bot-builder-video.jpg)](https://vimeo.com/170647056)

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

* Facebook Messenger 
* Slack (channel slash commands and apps with slash commands) 
* Skype
* Telegram

## Creating bots

Check out the [Getting Started](docs/GETTING_STARTED.md) guide for information on how to set up a simple bot in minutes and [API Documentation](docs/API.md) for detailed information on the API.

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
