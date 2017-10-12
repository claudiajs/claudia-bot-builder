# Skype Custom Messages and Message Templates

In this guide:

1. [Intro](#intro)
2. [Text messages](#text-messages)
3. [Emoticon messages](#emoticon-messages)
4. [Photo messages](#photo-messages)
5. [Carousel messages](#carousel-messages)
    1. [Hero](#hero-messages)
    2. [Thumbnail](#thumbnail-messages)
    3. [Receipt](#receipt-messages)
6. [Button types](#button-types)
7. [Typing messages](#typing-messages)
8. [Handling errors](#handling-errors)


## Intro

Skype Template Message builder allows you to generate more complex messages for Skype Messenger without writing JSON files manually.

To use it, just require `skypeTemplate` function from _Claudia Bot Builder_:

```javascript
const skypeTemplate = require('claudia-bot-builder').skypeTemplate;
```

`skypeTemplate` exports an object that contains multiple classes that allows you to generate different types of structured messages for Skype:

- Photo
- Carousel

Carousel class gives you ability to add Hero, Thumbnail and Receipt messages. See more here: https://docs.botframework.com/en-us/skype/getting-started/#cards-and-buttons

## Text messages

If you simply want to answer with the text you can just return text. And if you want your messages Markdown or XML support, use this API.

### API

`Text` (class) - Class that allows you to build a text messages.

_Arguments:_

- text, string (required) - message you want to send
- format, string (optional) - `plain`, `markdown` or `xml`. default is `plain`.

### Methods

| Method                   | Required | Arguments                                | Returns                           | Description                              |
| ------------------------ | -------- | ---------------------------------------- | --------------------------------- | ---------------------------------------- |
| get                      | Yes      | No arguments                             | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Skype Messenger |

### Example

```javascript
const botBuilder = require('claudia-bot-builder');
const skypeTemplate = botBuilder.skypeTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'skype')
    return new skypeTemplate.Text('**HELLO**!', 'markdown').get();
});
```
more markdown or XML syntax, refer to:  https://docs.microsoft.com/en-us/bot-framework/rest-api/bot-framework-rest-connector-create-messages



## Emoticon messages

Skype doesn't have specific API method for sending emoticons. If you want to send emoticon, just retun a string with emoticon shortcut. You can find list of emoticons and shortcuts here: https://support.skype.com/en/faq/FA12330/what-is-the-full-list-of-emoticons



## Photo messages

Photo attachment allows you to send images.

### API

`Photo` (class) - Class that allows you to build a photo messages.

_Arguments:_

- photo, base64 string URL (required) - a base64 encoded image.

### Methods

| Method                   | Required | Arguments                                | Returns                           | Description                              |
| ------------------------ | -------- | ---------------------------------------- | --------------------------------- | ---------------------------------------- |
| get                      | Yes      | No arguments                             | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Skype Messenger |

### Example

```javascript
const botBuilder = require('claudia-bot-builder');
const skypeTemplate = botBuilder.skypeTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'skype')
    return new skypeTemplate.Photo('data:image/png;base64,...').get();
});
```



## Carousel messages

Carousel class allows you to send cards and buttons.

### API

`Carousel` (class) - Class that allows you to build carousel with Skype cards and buttons.

_Arguments:_

- summary, string (optional) - a caption summary.
- text, integer (optional) - an optional text.

### Methods

| Method                   | Required | Arguments                                | Returns                           | Description                              |
| ------------------------ | -------- | ---------------------------------------- | --------------------------------- | ---------------------------------------- |
| addHero                  | No       | See [Hero](#hero-messages)               | `this` for chaining               | Hero card                                |
| addThumbnail             | No       | See [Thumbnail](#thumbnail-messages)     | `this` for chaining               | Thumbnail card                           |
| addReceipt               | No       | See [Receipt](#receipt-messages) section | `this` for chaining               | Receipt card                             |
| get                      | Yes      | No arguments                             | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Skype Messenger |

### Example

```javascript
const botBuilder = require('claudia-bot-builder');
const skypeTemplate = botBuilder.skypeTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'skype')
    return new skypeTemplate.Carousel('summary', 'text')
      .addHero(['http://lorempixel.com/400/200/'])
      .addThumbnail(['http://lorempixel.com/400/200/'])
      .addReceipt('$100')
      .get();
});
```



## Hero messages

Hero message requires Carousel class to be initialized.

### API

`addHero` (method) - Method that allows you to build Hero messages with optional images and buttons.

_Arguments:_

- images, array (required) - an array of urls of images.

### Methods

| Method                   | Required | Arguments                                | Returns                           | Description                              |
| ------------------------ | -------- | ---------------------------------------- | --------------------------------- | ---------------------------------------- |
| addTitle                 | No       | title (string, required, title for Hero)  | `this` for chaining               | Adds title on Hero message               |
| addSubtitle              | No       | subtitle (string, required, subtitle for Hero)  | `this` for chaining               | Adds subtitle on Hero message               |
| addText                  | No       | text (string, required, text for Hero)  | `this` for chaining               | Adds text on Hero message               |
| addButton                | No       | title (string, required, title of button), value (string, required, value of button), type (string, required, [Button types](#button-types))  | `this` for chaining               | Adds button on Hero message               |
| get                      | Yes      | No arguments                             | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Skype Messenger |

### Example

```javascript
const botBuilder = require('claudia-bot-builder');
const skypeTemplate = botBuilder.skypeTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'skype')
    return new skypeTemplate.Carousel()
      .addHero(['http://lorempixel.com/400/200/'])
        .addTitle('New Hero')
        .addSubtitle('Our new Hero')
        .addText('Some description')
          .addButton('Hi', 'hello', 'imBack')
          .addButton('Other button', 'hello again', 'imBack')
      .get();
});
```



## Thumbnail messages

Thumbnail message requires Carousel class to be initialized.

### API

`addThumbnail` (method) - Method that allows you to build Thumbnail messages with optional images and buttons.

_Arguments:_

- images, array (required) - an array of urls of images.

### Methods

| Method                   | Required | Arguments                                | Returns                           | Description                              |
| ------------------------ | -------- | ---------------------------------------- | --------------------------------- | ---------------------------------------- |
| addTitle                 | No       | title (string, required, title for Thumbnail)  | `this` for chaining               | Adds title on Thumbnail message               |
| addSubtitle              | No       | subtitle (string, required, subtitle for Thumbnail)  | `this` for chaining               | Adds subtitle on Thumbnail message               |
| addText                  | No       | text (string, required, text for Thumbnail)  | `this` for chaining               | Adds text on Thumbnail message               |
| addButton                | No       | title (string, required, title of button), value (string, required, value of button), type (string, required, [Button types](#button-types))  | `this` for chaining               | Adds button on Thumbnail message               |
| get                      | Yes      | No arguments                             | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Skype Messenger |

### Example

```javascript
const botBuilder = require('claudia-bot-builder');
const skypeTemplate = botBuilder.skypeTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'skype')
    return new skypeTemplate.Carousel()
      .addThumbnail(['http://lorempixel.com/400/200/'])
        .addTitle('New Thumbnail')
        .addSubtitle('Our new Thumbnail')
        .addText('Some description')
          .addButton('Hi', 'hello', 'imBack')
          .addButton('Other button', 'hello again', 'imBack')
      .get();
});
```



## Receipt messages

Receipt message requires Carousel class to be initialized.

### API

`addReceipt` (method) - Method that allows you to build Receipt messages with optional items and facts.

_Arguments:_

- total, string (required) - total value.
- tax, string (required) - tax value.
- vat, string (required) - vat value.

### Methods

| Method                   | Required | Arguments                                | Returns                           | Description                              |
| ------------------------ | -------- | ---------------------------------------- | --------------------------------- | ---------------------------------------- |
| addTitle                 | No       | title (string, required, title for Receipt)  | `this` for chaining               | Adds title on Receipt message               |
| addSubtitle              | No       | subtitle (string, required, subtitle for Receipt)  | `this` for chaining               | Adds subtitle on Receipt message               |
| addText                  | No       | text (string, required, text for Receipt)  | `this` for chaining               | Adds text on Receipt message               |
| addFact                  | No       | key (string, required, key for Fact), value (string, required, value for Fact)  | `this` for chaining               | Adds fact on Receipt message               |
| addItem                  | No       | title (string, optional), subtitle (string, optional), text (string, optional), price (string, optional), quantity (string, optional), image (string, optional), | `this` for chaining               | Adds item to Receipt message               |
| addButton                | No       | title (string, required, title of button), value (string, required, value of button), type (string, required, [Button types](#button-types))  | `this` for chaining               | Adds button on Receipt message               |
| get                      | Yes      | No arguments                             | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Skype Messenger |

### Example

```javascript
const botBuilder = require('claudia-bot-builder');
const skypeTemplate = botBuilder.skypeTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'skype')
    return new skypeTemplate.Carousel()
      .addReceipt('100')
        .addTitle('New Thumbnail')
        .addSubtitle('Our new Thumbnail')
        .addText('Some description')
          .addFact('factKey', 'I am fact')
          .addItem('Some item', 'I am some item', 'My description', '20', '5', 'http://lorempixel.com/400/200/')
          .addButton('Hi', 'hello', 'imBack')
          .addButton('Other button', 'hello again', 'imBack')
      .get();
});
```



## Typing messages

Typing message allows you to send typing event from chat bot.

### API

`Typing` (class) - Class that allows you to build a Typing message.

### Methods

| Method                   | Required | Arguments                                | Returns                           | Description                              |
| ------------------------ | -------- | ---------------------------------------- | --------------------------------- | ---------------------------------------- |
| get                      | Optional      | No arguments                             | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Skype Messenger |

### Example

```javascript
const botBuilder = require('claudia-bot-builder');
const skypeTemplate = botBuilder.skypeTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'skype')
    return new skypeTemplate.Typing();
});
```



## Button types

Skype buttons have specific types for the function they are supposed to do. Bellow is the table with the types and explanations:

### API

`addButton` (method) - Method that allows you to add a button.

_Arguments:_

- title, string (required) - text caption on button.
- value, string (required)
- type, string (required) - look table below.

| Type             | Explanation                                                           |
|------------------|-----------------------------------------------------------------------|
| openUrl          | Open given url in the built-in browser.                               |
| imBack           | Post message to bot, so all other participants will see that was posted to the bot and who posted this. |
| postBack         | Post message to bot privately, so other participants inside conversation will not see that was posted. |
| playAudio        | Playback audio container referenced by url.                           |
| playVideo        | Playback video container referenced by url.                           |
| showImage        | Show image referenced by url.                                         |
| downloadFile     | Download file referenced by url.                                      |
| signin           | Signin button.                                                        |

### Example

```javascript
const botBuilder = require('claudia-bot-builder');
const skypeTemplate = botBuilder.skypeTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'skype')
    return new skypeTemplate.Carousel('summary')
      .addReceipt('$100')
      .addButton('go to google!', 'https://www.google.com', 'openUrl')
      .get();
});
```



## Handling errors

Skype Template Message builder checks if messages you are generating are following Skype guidelines and limits, in case they are not an error will be thrown.

_Example:_

Calling `new skypeTemplate.Carousel().addHero('imageUrl')` where's `image` passed as string instead of array will throw `Images should be sent as array for the Skype Hero template` error.

All errors that Claudia bot builder's skypeTemplate library is throwing can be found [in the source code](../lib/skype/format-message.js).

Errors will be logged in Cloud Watch log for your bot.
