# Claudia Bot Builder

[![npm](https://img.shields.io/npm/v/claudia-bot-builder.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/claudia-bot-builder)
[![npm](https://img.shields.io/npm/dt/claudia-bot-builder.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/claudia-bot-builder)
[![npm](https://img.shields.io/npm/l/claudia-bot-builder.svg?maxAge=2592000?style=plastic)](https://github.com/claudiajs/claudia-bot-builder/blob/master/LICENSE)
[![Build Status](https://travis-ci.org/claudiajs/claudia-bot-builder.svg?branch=master)](https://travis-ci.org/claudiajs/claudia-bot-builder)
[![Join the chat at https://gitter.im/claudiajs/claudia](https://badges.gitter.im/claudiajs/claudia.svg)](https://gitter.im/claudiajs/claudia?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

_Claudia Bot Builder_ helps developers create and deploy chat-bots for various platforms in minutes to AWS Lambda. It simplifies the messaging workflows, automatically sets up the correct web hooks, and guides you through configuration steps, so that you can focus on important business problems and not have to worry about infrastructure code.

| [🚀 Getting Started](https://claudiajs.com/tutorials/hello-world-chatbot.html) | [🛠 API Docs](docs/API.md) | [🤖 Example projects](https://github.com/claudiajs/example-projects#chat-bots) | [🤔 FAQ](#frequently-asked-questions) | [💬 Chat on Gitter](https://gitter.im/claudiajs/claudia) |
|-----------------|----------|------------------|-----|----|

Check out [this two minute video](https://vimeo.com/170647056) to see how you can create and deploy a bot quickly:

[![](https://claudiajs.com/assets/claudia-bot-builder-video.jpg)](https://vimeo.com/170647056)

Here's a simple example:

```javascript
const botBuilder = require('claudia-bot-builder');
const excuse = require('huh');

module.exports = botBuilder(function (message) {
  return 'Thanks for sending ' + message.text +
    'Your message is very important to us, but ' +
    excuse.get();
});
```

This code is enough to operate bots for all supported platforms. Claudia Bot Builder automatically parses the incoming messages into a common format, so you can handle it easily. It also automatically packages the response into the correct message template for the requesting bot, so you do not have to worry about individual bot protocols.

## Supported platforms

* Facebook Messenger
* Slack (channel slash commands and apps with slash commands)
* Skype
* Viber
* Telegram
* Twilio (messaging service)
* Amazon Alexa
* Line
* Kik
* GroupMe

## Creating bots

[![](https://nodei.co/npm/claudia-bot-builder.svg?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/claudia-bot-builder)

Check out the [Getting Started](https://claudiajs.com/tutorials/hello-world-chatbot.html) guide for information on how to set up a simple bot in minutes and [API Documentation](docs/API.md) for detailed information on the API.

## Examples

See the [Chat-Bots section](https://github.com/claudiajs/example-projects#chat-bots) of the Claudia.js example projects list

## Frequently asked questions

1. **How to run it locally?**

   You can't. At least not easy. Claudia Bot Builder doesn't have a stand-alone http server in the background (such as Express, Hapi, etc.), instead it uses API Gateway and it's not trivial to simulate similar environment locally. Deploy it with `--version test` to create a separate test environment directly in AWS Lambda.

2. **How to test your bot?**

   Your chat bot is just a Lambda function, which means it is just a simple JavaScript function and you should be able to, at least in theory, run everything locally as simple automated tests.

   The most important thing is to design testable Lambda functions, [this guide](https://claudiajs.com/tutorials/designing-testable-lambdas.html) will help you to do that.

   Integration tests can be a bit more complex if you have some integrations with external or AWS services. Check [this guide](https://claudiajs.com/tutorials/testing-locally.html) to see how to write integration tests and run automated tests locally.

3. **My Facebook messenger bot responds to my messages only. Why it's not responding to everyone?**

   Facebook has [a review process](https://developers.facebook.com/docs/messenger-platform/app-review) for chat bots. Make sure your bot is approved.

4. **Can I send Slack slash command delayed responses?**

   Yes, here's [the tutorial for that](https://claudiajs.com/tutorials/slack-delayed-responses.html).

5. **What's new in v2?**

   It's a new major version because of the dependencies - there are big improvements in the _Claudia API Builder_ and _Claudia_, so _Claudia Bot Builder_ v1.x is not compatible with them.  
   V2.x also brings support for many new platforms.

6. **How to speed up the deployment**

   You can use `claudia update` with `--cache-api-config` flag to cache the API Gateway config, for more info visit [docs page for claudia update](https://github.com/claudiajs/claudia/blob/master/docs/update.md).

   Also, from version 2.7.0, you can disable platforms that you are not using, check the full explanation in the [API docs](https://github.com/claudiajs/claudia-bot-builder/blob/master/docs/API.md#selecting-platforms).

Have a question that is not on this list? Feel free to ask it on [Claudia chat on Gitter](https://gitter.im/claudiajs/claudia).

_Please, do not use GitHub issues for asking questions or requesting assistance/support, use it only to report bugs._

## Contributing

Contributions are greatly appreciated. See the [Contributors' guide](CONTRIBUTING.md) for information on running and testing code.

## What's new since...?

See the [Release History](https://github.com/claudiajs/claudia-bot-builder/releases)

## Cool things built with _Claudia bot Builder_

- [AWS Bot for Slack](https://github.com/andypowe11/AWS-Claudia-AWSBot) - A Slack bot to stop and start selected AWS EC2 instances and generally keep an eye on your AWS estate.
- [Comic Book Bot](https://github.com/stojanovic/comic-book-bot) - A simple Viber chatbot for Marvel characters.
- [DotCom Bot](http://dotcom.montoyaindustries.com) - Search & buy domain names and check @usernames fast on Slack & Facebook Messenger!
- [Eksplorer](http://eksplo.weebly.com) - The Facebook chat bot that will help you discover amazing things in your neighborhood.
- [Fact Bot](https://github.com/claudiajs/example-projects/tree/master/bot-with-buttons) - The bot will query WikiData for anything you send it and print out the facts.
- [Food Recommendation Bot](https://github.com/lnmunhoz/food-recommendation-bot) - Shows you open restaurants around you based on Google Places API.
- [JS Belgrade bot](https://github.com/JSBelgrade/jsbelgrade-chatbot) - Simple meetup group Telegram chatbot created during the meetup.
- [LaptopFriendly Bot](https://github.com/stojanovic/laptop-friendly-bot) - Viber bot for [LaptopFriendly.co](https://laptopfriendly.co).
- [MrRoadboto](https://github.com/antsankov/MrRoadboto) - A low-bandwidth and easy to use Facebook chat bot that serves Colorado's Department of Transportation (CDOT) alerts for I70 road-closures affecting major ski resorts. You can read about the motivation [here](https://medium.com/@antsankov/domo-arigato-mr-roadboto-pt-1-introducing-the-problem-b0d44e384dc#.tcsq9nrs4).
- [PingdomBot](https://github.com/andypowe11/AWS-Claudia-PingdomBot) - A Slack bot to see the status of Pingdom website monitoring.
- [Pokemon Lookup bot](https://www.facebook.com/PokedexLookup/) - Simple pokemon lookup bot, [source code](https://github.com/kirkins/PokedexBot).
- [QRCode Bot](https://www.facebook.com/QRCode-Bot-1779956152289103/) - Artistic QR code maker, [source code](https://github.com/jveres/qrcode-bot).
- [Quote bot](https://github.com/philnash/quote-bot) - A very simple bot that will respond with an inspirational quote from the Forismatic API.
- [Robbert](https://www.facebook.com/Robbert-1119546194768078) - General chatbot.
- [slackslash-radar](https://github.com/Ibuprofen/slackslash-radar) - A Claudiajs bot which retrieves a Wunderground radar animated gif and posts to Slack.
- [Space Explorer Bot](https://github.com/stojanovic/space-explorer-bot) - A simple Messenger chat bot that uses NASA's API to get the data and images about the Space.
- [Space Explorer Bot for Viber](https://github.com/stojanovic/space-explorer-bot-viber) - Viber version of Space Explorer Bot.
- [Vacation tracker bot](http://vacationtrackerbot.com/) - A simple Slack bot to help you manage your team’s vacations, sick days and days off.
- [MDNBot](https://vejather.github.io/mdn-bot-landing-page/) - A Slack bot that helps developers search MDN directory without leaving Slack channel.
- [Ver.bot](https://rping.github.io/Ver.bot-site) - Subscribe GitHub, npm, PyPI projects, and get new version releases notifications!

Building something cool with Claudia Bot Builder? Let us know or send a PR to update this list!

## Authors

* [Gojko Adžić](https://github.com/gojko)
* [Aleksandar Simović](https://github.com/simalexan)
* [Slobodan Stojanović](https://github.com/stojanovic)

## License

MIT -- see [LICENSE](LICENSE)
