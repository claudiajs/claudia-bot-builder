# Viber Custom Messages and Message Templates

In this guide:

1. [Intro](#intro)
2. [Text messages](#text-messages)
3. [Custom Keyboard](#custom-keyboards)
4. [Photo messages](#photo-messages)
5. [Video messages](#video-messages)
6. [File messages](#file-messages)
7. [Contact messages](#contact-messages)
8. [Location messages](#location-messages)
9. [URL messages](#url-messages)
10. [Sticker messages](#sticker-messages)
11. [Sending multiple messages](#sending-multiple-messages)
12. [Handling errors](#handling-errors)


## Intro

Viber Template Message builder allows you to generate more complex messages for Viber without writing JSON files manually.

To use it, just require `viberTemplate` function from _Claudia Bot Builder_:

```javascript
const viberTemplate = require('claudia-bot-builder').viberTemplate;
```

`viberTemplate` exports an object that contains multiple classes that allows you to generate different types of structured messages for Viber:

- Text messages (we need a template for this just in case you want to add custom keyboard to it)
- Photo
- Video
- File
- Contact
- Location
- Url
- Sticker

More info about each type of structured messages can be found in [the official documentation](https://developers.viber.com/customer/portal/articles/2554327-introducing-public-accounts?b_id=15145).

## Text messages

If you simply want to answer with the text you can just return text. But in case you want to answer with text with a custom keyboard you should use Text method.

### API

`Text` (class) - Class that allows you to build text messages with custom keyboard.

_Arguments:_

- text, string (required) - a simple text to send as a reply.

### Methods

| Method                   | Required | Arguments                                | Returns                           | Description                              |
| ------------------------ | -------- | ---------------------------------------- | --------------------------------- | ---------------------------------------- |
| addReplyKeyboard  | No       | **isDefaultHeight** (boolean, optional, is keyboard default height, default is true), <br/><br/>**backgroundColor** (string, optional, keyboard background color) | `this` for chaining               | Adds a custom keyboard |
| addKeyboardButton | No       | **text** (string, required, button text), <br/><br/>**buttonValue** (string, required, url or text value that will be returned on press), <br/><br/>**columnSize** (number, optional, a width of the button), <br/><br/>**rowSize** (number, optional, a height of the button), <br/><br/>**buttonObj** (object, optional, additional button settings, should be a valid values from [Viber Keyboard docs](https://developers.viber.com/customer/en/portal/articles/2567880-keyboards?b_id=15145#buttons-parameters)) | `this` for chaining               | Viber button on a keyboard, more info is available [here](https://developers.viber.com/customer/en/portal/articles/2567880-keyboards?b_id=15145) |
| get               | Yes      | No arguments                             | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Viber |

### Example

```javascript
const botBuilder = require('claudia-bot-builder');
const viberTemplate = botBuilder.viberTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'viber')
    new viberTemplate.Text(`What's your favorite House in Game Of Thrones`)
      .addReplyKeyboard()
        .addKeyboardButton('Stark', 'STARK', 6, 1)
        .addKeyboardButton('Lannister', 'LANNISTER', 6, 1)
        .addKeyboardButton('Targaryen', 'TARGARYEN', 6, 1)
        .addKeyboardButton('None of the above', 'OTHER', 6, 1)
      .get();
});
```



## Custom Keyboards

Each of the methods below has 2 methods for adding custom keyboards and buttons.

Following methods are allowed:

- addReplyKeyboard
- addKeyboardButton - only when keyboard is added, otherwise it'll throw an error

If you add multiple keyboards only the last one will be active



## Photo messages

Photo attachment allows you to send images.

### API

`Photo` (class) - Class that allows you to build a photo messages with optional custom keyboards.

_Arguments:_

- photo, string (required) - an url or an ID of already uploaded image.
- caption, string (optional) - a caption for an image, default is an empty string ('')

### Methods

| Method                   | Required | Arguments                                | Returns                           | Description                              |
| ------------------------ | -------- | ---------------------------------------- | --------------------------------- | ---------------------------------------- |
| addReplyKeyboard  | No       | **isDefaultHeight** (boolean, optional, is keyboard default height, default is true), <br/><br/>**backgroundColor** (string, optional, keyboard background color) | `this` for chaining               | Adds a custom keyboard |
| addKeyboardButton | No       | **text** (string, required, button text), <br/><br/>**buttonValue** (string, required, url or text value that will be returned on press), <br/><br/>**columnSize** (number, optional, a width of the button), <br/><br/>**rowSize** (number, optional, a height of the button), <br/><br/>**buttonObj** (object, optional, additional button settings, should be a valid values from [Viber Keyboard docs](https://developers.viber.com/customer/en/portal/articles/2567880-keyboards?b_id=15145#buttons-parameters)) | `this` for chaining               | Viber button on a keyboard, more info is available [here](https://developers.viber.com/customer/en/portal/articles/2567880-keyboards?b_id=15145) |
| get               | Yes      | No arguments                             | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Viber |

### Example

```javascript
const botBuilder = require('claudia-bot-builder');
const viberTemplate = botBuilder.viberTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'viber')
    return new viberTemplate.Photo('https://claudiajs.com/assets/claudiajs.png').get();
});
```



## Video messages

Video message allows you to send videos.

### API

`Video` (class) - Class that allows you to build a video messages with optional custom keyboards.

_Arguments:_

- media, string (required) - an url of a video.
- size, number (required) - a size of the video in bytes.
- duration, integer (optional) - an optional duration of a video file.

### Methods

| Method                   | Required | Arguments                                | Returns                           | Description                              |
| ------------------------ | -------- | ---------------------------------------- | --------------------------------- | ---------------------------------------- |
| addReplyKeyboard  | No       | **isDefaultHeight** (boolean, optional, is keyboard default height, default is true), <br/><br/>**backgroundColor** (string, optional, keyboard background color) | `this` for chaining               | Adds a custom keyboard |
| addKeyboardButton | No       | **text** (string, required, button text), <br/><br/>**buttonValue** (string, required, url or text value that will be returned on press), <br/><br/>**columnSize** (number, optional, a width of the button), <br/><br/>**rowSize** (number, optional, a height of the button), <br/><br/>**buttonObj** (object, optional, additional button settings, should be a valid values from [Viber Keyboard docs](https://developers.viber.com/customer/en/portal/articles/2567880-keyboards?b_id=15145#buttons-parameters)) | `this` for chaining               | Viber button on a keyboard, more info is available [here](https://developers.viber.com/customer/en/portal/articles/2567880-keyboards?b_id=15145) |
| get               | Yes      | No arguments                             | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Viber |

### Example

```javascript
const botBuilder = require('claudia-bot-builder');
const viberTemplate = botBuilder.viberTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'viber')
    return new viberTemplate.Video('http://example.com/videos/video.mp4', 1024).get();
});
```



## File messages

File messages allows you to send files with optional custom keyboard. Multiple file formats can be sent, but there's a list of [forbidden formats in Viber documentation](https://developers.viber.com/customer/en/portal/articles/2541358-forbidden-file-formats?b_id=15145).

### API

`File` (class) - Class that allows you to build a file messages with optional custom keyboards.

_Arguments:_

- media, string (required) - an url of a file.
- size, number (required) - file size in bytes.
- filename, string (required) -  a name of the file

### Methods

| Method                   | Required | Arguments                                | Returns                           | Description                              |
| ------------------------ | -------- | ---------------------------------------- | --------------------------------- | ---------------------------------------- |
| addReplyKeyboard  | No       | **isDefaultHeight** (boolean, optional, is keyboard default height, default is true), <br/><br/>**backgroundColor** (string, optional, keyboard background color) | `this` for chaining               | Adds a custom keyboard |
| addKeyboardButton | No       | **text** (string, required, button text), <br/><br/>**buttonValue** (string, required, url or text value that will be returned on press), <br/><br/>**columnSize** (number, optional, a width of the button), <br/><br/>**rowSize** (number, optional, a height of the button), <br/><br/>**buttonObj** (object, optional, additional button settings, should be a valid values from [Viber Keyboard docs](https://developers.viber.com/customer/en/portal/articles/2567880-keyboards?b_id=15145#buttons-parameters)) | `this` for chaining               | Viber button on a keyboard, more info is available [here](https://developers.viber.com/customer/en/portal/articles/2567880-keyboards?b_id=15145) |
| get               | Yes      | No arguments                             | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Viber |

### Example

```javascript
const botBuilder = require('claudia-bot-builder');
const viberTemplate = botBuilder.viberTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'viber')
    return new viberTemplate.File('http://example.com/files/file.pdf', 1024, 'Random file').get();
});
```



## Contact messages

Contact messages allows you to send a contact info.

### API

`Contact` (class) - Class that allows you to build a contact messages with optional custom keyboards.

_Arguments:_

- name, string (required) - contact name.
- phoneNumber, string (required) - contact phone number.

### Methods

| Method                   | Required | Arguments                                | Returns                           | Description                              |
| ------------------------ | -------- | ---------------------------------------- | --------------------------------- | ---------------------------------------- |
| addReplyKeyboard  | No       | **isDefaultHeight** (boolean, optional, is keyboard default height, default is true), <br/><br/>**backgroundColor** (string, optional, keyboard background color) | `this` for chaining               | Adds a custom keyboard |
| addKeyboardButton | No       | **text** (string, required, button text), <br/><br/>**buttonValue** (string, required, url or text value that will be returned on press), <br/><br/>**columnSize** (number, optional, a width of the button), <br/><br/>**rowSize** (number, optional, a height of the button), <br/><br/>**buttonObj** (object, optional, additional button settings, should be a valid values from [Viber Keyboard docs](https://developers.viber.com/customer/en/portal/articles/2567880-keyboards?b_id=15145#buttons-parameters)) | `this` for chaining               | Viber button on a keyboard, more info is available [here](https://developers.viber.com/customer/en/portal/articles/2567880-keyboards?b_id=15145) |
| get               | Yes      | No arguments                             | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Viber |

### Example

```javascript
const botBuilder = require('claudia-bot-builder');
const viberTemplate = botBuilder.viberTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'viber')
    return new viberTemplate.Contact('Alex', '+972511123123').get();
});

```



## Location messages

Location template allows you to send a location.

### API

`Location` (class) - Class that allows you to build a location messages with optional custom keyboards.

_Arguments:_

- latitude, number (required) - location latitude.
- longitude, number (required) - location longitude.

### Methods

| Method                   | Required | Arguments                                | Returns                           | Description                              |
| ------------------------ | -------- | ---------------------------------------- | --------------------------------- | ---------------------------------------- |
| addReplyKeyboard  | No       | **isDefaultHeight** (boolean, optional, is keyboard default height, default is true), <br/><br/>**backgroundColor** (string, optional, keyboard background color) | `this` for chaining               | Adds a custom keyboard |
| addKeyboardButton | No       | **text** (string, required, button text), <br/><br/>**buttonValue** (string, required, url or text value that will be returned on press), <br/><br/>**columnSize** (number, optional, a width of the button), <br/><br/>**rowSize** (number, optional, a height of the button), <br/><br/>**buttonObj** (object, optional, additional button settings, should be a valid values from [Viber Keyboard docs](https://developers.viber.com/customer/en/portal/articles/2567880-keyboards?b_id=15145#buttons-parameters)) | `this` for chaining               | Viber button on a keyboard, more info is available [here](https://developers.viber.com/customer/en/portal/articles/2567880-keyboards?b_id=15145) |
| get               | Yes      | No arguments                             | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Viber |

### Example

```javascript
const botBuilder = require('claudia-bot-builder');
const viberTemplate = botBuilder.viberTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'viber')
    return new viberTemplate.Location(44.831115, 20.421277).get();
});
```



## URL messages

URL template allows you to send a link.

### API

`Url` (class) - Class that allows you to build a link messages with optional custom keyboards.

_Arguments:_

- url, string (required) - valid URL.

### Methods

| Method                   | Required | Arguments                                | Returns                           | Description                              |
| ------------------------ | -------- | ---------------------------------------- | --------------------------------- | ---------------------------------------- |
| addReplyKeyboard  | No       | **isDefaultHeight** (boolean, optional, is keyboard default height, default is true), <br/><br/>**backgroundColor** (string, optional, keyboard background color) | `this` for chaining               | Adds a custom keyboard |
| addKeyboardButton | No       | **text** (string, required, button text), <br/><br/>**buttonValue** (string, required, url or text value that will be returned on press), <br/><br/>**columnSize** (number, optional, a width of the button), <br/><br/>**rowSize** (number, optional, a height of the button), <br/><br/>**buttonObj** (object, optional, additional button settings, should be a valid values from [Viber Keyboard docs](https://developers.viber.com/customer/en/portal/articles/2567880-keyboards?b_id=15145#buttons-parameters)) | `this` for chaining               | Viber button on a keyboard, more info is available [here](https://developers.viber.com/customer/en/portal/articles/2567880-keyboards?b_id=15145) |
| get               | Yes      | No arguments                             | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Viber |

### Example

```javascript
const botBuilder = require('claudia-bot-builder');
const viberTemplate = botBuilder.viberTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'viber')
    return new viberTemplate.Url('https://claudiajs.com').get();
});
```


## Sticker messages

Sticker template allows you to send a Viber sticker.

### API

`Sticker` (class) - Class that allows you to build a sticker messages with optional custom keyboards.

_Arguments:_

- stickerId, number (required) - valid sticker ID, check [Viber documentation](https://developers.viber.com/customer/portal/articles/2645276-sticker-ids) for more info.

### Methods

| Method                   | Required | Arguments                                | Returns                           | Description                              |
| ------------------------ | -------- | ---------------------------------------- | --------------------------------- | ---------------------------------------- |
| addReplyKeyboard  | No       | **isDefaultHeight** (boolean, optional, is keyboard default height, default is true), <br/><br/>**backgroundColor** (string, optional, keyboard background color) | `this` for chaining               | Adds a custom keyboard |
| addKeyboardButton | No       | **text** (string, required, button text), <br/><br/>**buttonValue** (string, required, url or text value that will be returned on press), <br/><br/>**columnSize** (number, optional, a width of the button), <br/><br/>**rowSize** (number, optional, a height of the button), <br/><br/>**buttonObj** (object, optional, additional button settings, should be a valid values from [Viber Keyboard docs](https://developers.viber.com/customer/en/portal/articles/2567880-keyboards?b_id=15145#buttons-parameters)) | `this` for chaining               | Viber button on a keyboard, more info is available [here](https://developers.viber.com/customer/en/portal/articles/2567880-keyboards?b_id=15145) |
| get               | Yes      | No arguments                             | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Viber |

### Example

```javascript
const botBuilder = require('claudia-bot-builder');
const viberTemplate = botBuilder.viberTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'viber')
    return new viberTemplate.Sticker(40126).get();
});
```


## Sending multiple messages

It's easy to send multiple messages, just pass an array with at least one of the methods mentioned above. You can combine them how ever you want.

### Example

```javascript
const botBuilder = require('claudia-bot-builder');
const viberTemplate = botBuilder.viberTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'viber')
    return [
      'Hello!',
      new viberTemplate.Text(`What's your favorite House in Game Of Thrones`)
        .addReplyKeyboard()
          .addKeyboardButton('Stark', 'STARK', 6, 1)
          .addKeyboardButton('Lannister', 'LANNISTER', 6, 1)
          .addKeyboardButton('Targaryen', 'TARGARYEN', 6, 1)
          .addKeyboardButton('None of the above', 'OTHER', 6, 1)
        .get()
    ];
});
```



## Handling errors

Viber Template Message Builder checks if messages you are generating are following Viber Messenger guidelines and limits, in case they are not an error will be thrown.

_Example:_

Calling `new viberTemplate.Text()` without `text` will throw `Text is required for the Viber Text template` error.

All errors that Claudia bot builder's `viberTemplate` library is throwing can be found [in the source code](../lib/viber/format-message.js).

Errors will be logged in Cloud Watch log for your bot.
