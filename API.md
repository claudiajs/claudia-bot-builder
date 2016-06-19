# Claudia Bot Builder API

The Claudia Bot Builder is based on a simple callback API. Whenever a message is received by an endpoint, the Bot Builder will parse the message and pass it on to your callback. Register the endpoint by executing the `claudia-bot-builder` function and export the result from your module.

```javascript
const botBuilder = require('claudia-bot-builder');

module.exports = botBuilder(request =>
  `I got ${request.text}`
);
```

## Request object structure

The request object contains the following fields

* `text`: `string` the text of the message received, extracted from a bot-specific format. In most cases, if you just want to reply to text messages, this is the only piece of information you'll need.
* `type`: `string` the type of the end-point receiving the message. It can be `facebook`, `slack-slash-command`, `skype` or `telegram` 
* `originalRequest`: `object` the complete original message, in a bot-specific format, useful if you want to do more than just reply to text messages.
* `sender`: `string` the identifier of the sender
* `postback`: `boolean` true if the message is the result of a post-back (for example clicking on a button created by a previous message in Facebook). It will be `undefined` (falsy) for completely new messages.

## Reply formats

If you reply with a string, the response will be packaged in a bot-specific format representing a simple text message. _Claudia Bot Builder_ helps in that way to handle generic simple text responses easily.

Individual bots support more complex responses, such as buttons, attachments and so on. You can send all those responses by replying with an object, instead of a string. In that case, _Claudia Bot Builder_ does not transform the response at all, and just passes it back to the sender. It's then your responsibility to ensure that the resulting object is in the correct format for the bot engine. Use `request.type` to discover the bot engine sending the requests.

Additionally, _Claudia Bot Builder_ exports a template message builder for Facebook and you can use it to generate more complex responses including buttons, receipts and attachments.

### Synchronous replies

Just return the result from the function. 

### Asynchronous replies

Return a `Promise` from the callback function, and resolve the promise later with a string or object. The convention is the same as for synchronous replies. 

If you plan to reply asynchronously, make sure to configure your lambda function so it does not get killed prematurely. By default, Lambda functions are only allowed to run for 3 seconds. See [update-function-configuration](http://docs.aws.amazon.com/cli/latest/reference/lambda/update-function-configuration.html) in the AWS Command Line tools for information on how to change the default timeout.

### Facebook Template Message builder

Facebook Template Message builder allows you to generate more complex messages for Facebook Messenger without writing JSON files manually.

To use it, just require `fbTemplate` function from _Claudia Bot Builder_:

```js
const fbTemplate = require('claudia-bot-builder').fbTemplate;
```

`fbTemplate` exports an object that contains 4 classes that allows you to generate 4 different types of Facebook Messenger structured messages:

- Generic template messages
- Button template messages
- Receipt template messages
- Image attachment messages

More info about each type of structured messages can be found in [Facebook Messenger's Complete guide](https://developers.facebook.com/docs/messenger-platform/implementation#send_message).

#### Generic template

The Generic Template can take an image, title, subtitle, description and buttons. This template can support multiple bubbles per message and display them as a horizontal list.

__API__:

`generic` (class) - Class that allows you to build Generic template messages

Methods:

| Method    | Required | Arguments   | Returns             | Description |
|-----------|----------|-------------|---------------------|-------------|
| addBubble | Yes      | title (string, required), subtitle (string)    | `this` for chaining | Each Generic template can have 1 to 10 elements/bubbles, before you add anything to it. It requires element's title, but it can also accept element's subtitle |
| addUrl    | No       | A valid URL | `this` for chaining | Adds an url to a current element, requires a valid URL |
| addImage  | No       | A valid URL | `this` for chaining | Adds an image to a current element, requires a valid URL |
| addButton | Yes      | title (string, required), value (required, string or a valid URL) | `this` for chaining | Adds a button to a current element, each button requires a title and a value, where value can be any string if you want `postback` type or a valid URL if you want it's type to be `web_url`, at least one button is required, and maximum 3 of them is allowed |
| get       | Yes      | No args.    | Formatted JSON      | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Facebook Messenger |

*_Required arguments_, Messenger requires all elements to have those values, the message builder will throw an error if you don't provide it.

__Example__:

```js
const botBuilder = require('claudia-bot-builder');
const fbTemplate = require('claudia-bot-builder').fbTemplate;

module.exports = botBuilder(request => {
  if (request.type === 'facebook') {
    const generic = new fbTemplate.generic();
    
    return generic
      .addBubble('Claudia.js', 'Deploy Node.js microservices to AWS easily')
        .addUrl('https://claudiajs.com')
        .addImage('https://github.com/claudiajs/claudiajs.com/blob/master/assets/claudiajs.png')
        .addButton('Say hello', 'HELLO')
        .addButton('Go to Github', 'https://github.com/claudiajs/claudia')
      .addBubble('Claudia Bot Builder')
      	.addImage('https://github.com/claudiajs/claudiajs.com/blob/master/assets/claudia-bot-builder-video.jpg')
      	.addButton('Go to Github', 'https://github.com/claudiajs/claudia-bot-builder')
      .get();
  }
});
```

#### Button template

The Button Template is useful when you want to present simple text with options, it has the same buttons as Generic template, but it doesn't allow element image and URL, it also doesn't allow multiple elements.

__API__:

`generic` (class) - Class that allows you to build Generic template messages

Methods:

| Method    | Required | Arguments   | Returns             | Description |
|-----------|----------|-------------|---------------------|-------------|
| addButton | Yes      | title (string, required), value (required, string or a valid URL) | `this` for chaining | Adds a button to a current element, each button requires a title and a value, where value can be any string if you want `postback` type or a valid URL if you want it's type to be `web_url`, at least one button is required, and maximum 3 of them is allowed |
| get       | Yes      | No args.    | Formatted JSON      | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Facebook Messenger |

*_Required arguments_, Messenger requires all elements to have those values, the message builder will throw an error if you don't provide it.

__Example__:

```
const botBuilder = require('claudia-bot-builder');
const fbTemplate = require('claudia-bot-builder').fbTemplate;

module.exports = botBuilder(request => {
  if (request.type === 'facebook') {
    return new fbTemplate.button('How are you?')
      .addButton('Awesome', 'AWESOME')
      .addButton('Great', 'GREAT')
      .addButton('🎵🎵🎵', 'https://youtu.be/m5TwT69i1lU')
      .get();
  }
});

```

#### Receipt template

#### Image attachment

#### Handling errors

## Bot configuration

_Claudia Bot Builder_ automates most of the configuration tasks, and stores access keys and tokens into API Gateway stage variables. You can configure those interactively while executing `claudia create` or `claudia update` by passing an additional argument from the command line:

* For Facebook messenger bots, use `--configure-fb-bot`
* For Slack App slash commands, use `--configure-slack-slash-app`
* For Slack slash commands for your team, use `--configure-slack-slash-command`
* For Skype, use `--configure-skype-bot`
* For Telegram, use `--configure-telegram-bot`

You need to do this only once per version. If you create different versions for development, testing and production, remember to configure the bots.
