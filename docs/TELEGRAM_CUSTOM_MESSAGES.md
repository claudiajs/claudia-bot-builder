# Telegram Custom Messages and Message Templates

In this guide:

1. [Intro](#intro)
2. [Text messages](#text-messages)
3. [Custom Keyboard](#custom-keyboards)
4. [Photo messages](#photo-messages)
5. [Audio messages](#audio-messages)
6. [Location messages](#location-messages)
7. [Venue messages](#venue-messages)
8. [Sticker messages](#sticker-messages)
9. [Contact messages](#contact-messages)
10. [Changing chat action](#changing-chat-action)
11. [Pause between messages](#pause-between-messages)
12. [Other attachments](#other-attachments)
13. [Sending multiple messages](#sending-multiple-messages)
14. [Handling errors](#handling-errors)


## Intro

Telegram Template Message builder allows you to generate more complex messages for Telegram Messenger without writing JSON files manually.

To use it, just require `telegramTemplate` function from _Claudia Bot Builder_:

```javascript
const telegramTemplate = require('claudia-bot-builder').telegramTemplate;
```

`telegramTemplate` exports an object that contains multiple classes that allows you to generate different types of structured messages for Telegram:

- Text messages (we need a template for this just in case you want to add custom keyboard to it)
- Photo
- Audio
- Location
- Venue
- ChatAction

It also allows you to make a pause before the next message.

More info about each type of structured messages can be found in [the official documentation](https://core.telegram.org/bots/api).

## Text messages

If you simply want to answer with the text you can just return text. But in case you want to answer with text with a custom keyboard or Markdown support you can use Text method.

### API

`Text` (class) - Class that allows you to build text messages with custom keyboards and with Markdown support.

_Arguments:_

- text, string (required) - a simple text to send as a reply.

### Methods

| Method            | Required | Arguments                                | Returns                           | Description                              |
| ----------------- | -------- | ---------------------------------------- | --------------------------------- | ---------------------------------------- |
| disableMarkdown   | No       | No arguments                             | `this` for chaining               | Disables Markdown support, it's enabled by default |
| addReplyKeyboard  | No       | keyboardArray (array, required, an array of keyboard keys), resizeKeyboard (boolean, optional, if the keyboard should be resizable), oneTimeKeyboard (boolean, optional, if the keyboard should be hidden after first usage) | `this` for chaining               | Telegram ReplyKeyboardMarkup, for more info visit [official docs](https://core.telegram.org/bots/api#replykeyboardmarkup) |
| addInlineKeyboard | No       | keyboardArray (array, required, an array of keyboard keys) | `this` for chaining               | Telegram InlineKeyboardMarkup, for more info visit [official docs](https://core.telegram.org/bots/api#inlinekeyboardmarkup) |
| replyKeyboardHide | No       | selective (boolean, optional, use this parameter if you want to hide keyboard for specific users only ) | `this` for chaining               | Telegram ReplyKeyboardHide, for more info visit [official docs](https://core.telegram.org/bots/api#replykeyboardhide) |
| forceReply        | No       | selective (boolean, optional, use this parameter if you want to hide keyboard for specific users only ) | `this` for chaining               | Telegram ForceReply, for more info visit [official docs](https://core.telegram.org/bots/api#forcereply) |
| get               | Yes      | No arguments                             | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Telegram Messenger |

### Example

```javascript
const botBuilder = require('claudia-bot-builder');
const telegramTemplate = botBuilder.telegramTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'telegram')
    return new telegramTemplate.Text(`What's your favorite House in Game Of Thrones`)
      .addReplyKeyboard([['Stark'], ['Lannister'], ['Targaryen'], ['None of the above']])
      .get();
});
```



## Custom Keyboards

Each of the methods below except `Pause` and `ChatAction` has 4 methods for controling and creating custom keyboards. Only one of them can be used, if you add more of them only the last one will be active.

Following methods are allowed, each of them represents one keyboard markup:

- addReplyKeyboard
- addInlineKeyboard
- replyKeyboardHide
- forceReply

### Methods

| Method            | Required | Arguments                                | Returns             | Description                              |
| ----------------- | -------- | ---------------------------------------- | ------------------- | ---------------------------------------- |
| addReplyKeyboard  | No       | keyboardArray (array, required, an array of keyboard keys), resizeKeyboard (boolean, optional, if the keyboard should be resizable), oneTimeKeyboard (boolean, optional, if the keyboard should be hidden after first usage) | `this` for chaining | Telegram ReplyKeyboardMarkup, for more info visit [official docs](https://core.telegram.org/bots/api#replykeyboardmarkup) |
| addInlineKeyboard | No       | keyboardArray (array, required, an array of keyboard keys) | `this` for chaining | Telegram InlineKeyboardMarkup, for more info visit [official docs](https://core.telegram.org/bots/api#inlinekeyboardmarkup) |
| replyKeyboardHide | No       | selective (boolean, optional, use this parameter if you want to hide keyboard for specific users only ) | `this` for chaining | Telegram ReplyKeyboardHide, for more info visit [official docs](https://core.telegram.org/bots/api#replykeyboardhide) |
| forceReply        | No       | selective (boolean, optional, use this parameter if you want to hide keyboard for specific users only ) | `this` for chaining | Telegram ForceReply, for more info visit [official docs](https://core.telegram.org/bots/api#forcereply) |

### Example

Reply keyboard:

```javascript
const botBuilder = require('claudia-bot-builder');
const telegramTemplate = botBuilder.telegramTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'telegram')
    return new telegramTemplate.Text(`What's your favorite House in Game Of Thrones`)
      .addReplyKeyboard([['Stark'], ['Lannister'], ['Targaryen'], ['None of the above']])
      .get();
});
```

Inline keyboard:

```javascript
const botBuilder = require('claudia-bot-builder');

module.exports = botBuilder(message => {
  if (message.type === 'telegram')
    return new telegramTemplate.Text(`Claudia Bot Builder`)
      .addInlineKeyboard([
      	[{
          text: 'Website',
          url: 'https://claudiajs.com'
      	}],
        [{
          text: 'Tell me more',
          callback_data: 'MORE'
        }]
      ])
      .get();
});
```



## Photo messages

Photo attachment allows you to send images.

### API

`Photo` (class) - Class that allows you to build a photo messages with optional custom keyboards.

_Arguments:_

- photo, string (required) - an url or an ID of already uploaded image.
- caption, string (optional) - a caption for an image.

### Methods

| Method                   | Required | Arguments                                | Returns                           | Description                              |
| ------------------------ | -------- | ---------------------------------------- | --------------------------------- | ---------------------------------------- |
| Custom Keyboards methods | No       | See [Custom Keyboard](#custom-keyboards) section | `this` for chaining               | See [Custom Keyboard](#custom-keyboards) section |
| get                      | Yes      | No arguments                             | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Telegram Messenger |

### Example

```javascript
const botBuilder = require('claudia-bot-builder');
const telegramTemplate = botBuilder.telegramTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'telegram')
    return new telegramTemplate.Photo('https://claudiajs.com/assets/claudiajs.png').get();
});
```



## Audio messages

Audio attachment allows you to send audio files. If you want to send a voice message Telegram has `sendVoice` method, but it is not a part of this builder at the moment.

### API

`Audio` (class) - Class that allows you to build an audio messages with optional custom keyboards.

_Arguments:_

- audio, string (required) - an url or an ID of already uploaded image.
- caption, string (optional) - a caption for an image.
- duration, integer (optional) - an optional duration of an audio file.

### Methods

| Method                   | Required | Arguments                                | Returns                           | Description                              |
| ------------------------ | -------- | ---------------------------------------- | --------------------------------- | ---------------------------------------- |
| addTitle                 | No       | title (string, optional, audio file title) | `this` for chaining               | Track name                               |
| addPerformer             | No       | performer (string, optional, audio file title) | `this` for chaining               | Performer name                           |
| Custom Keyboards methods | No       | See [Custom Keyboard](#custom-keyboards) section | `this` for chaining               | See [Custom Keyboard](#custom-keyboards) section |
| get                      | Yes      | No arguments                             | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Telegram Messenger |

### Example

```javascript
const botBuilder = require('claudia-bot-builder');
const telegramTemplate = botBuilder.telegramTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'telegram')
    return new telegramTemplate.Audio('http://www.noiseaddicts.com/samples_1w72b820/4927.mp3')
      .addTitle('Roar')
      .addPerformer('Bear')
      .get();
});
```



## File messages

File attachment allows you to send any files.

### API

`File` (class) - Class that allows you to build file messages with optional custom keyboards.

_Arguments:_

- document, string (required) - an url or an ID of already uploaded file.
- caption, string (optional) - a caption for file.

### Methods

| Method                   | Required | Arguments                                | Returns                           | Description                              |
| ------------------------ | -------- | ---------------------------------------- | --------------------------------- | ---------------------------------------- |
| Custom Keyboards methods | No       | See [Custom Keyboard](#custom-keyboards) section | `this` for chaining               | See [Custom Keyboard](#custom-keyboards) section |
| get                      | Yes      | No arguments                             | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Telegram Messenger |

### Example

```javascript
const botBuilder = require('claudia-bot-builder');
const telegramTemplate = botBuilder.telegramTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'telegram')
    return new telegramTemplate.File('http://example.com/files/file.pdf', 'Some File').get();
});
```



## Location messages

Location template allows you to send a location, if you want to send a location of some venue use [Venue message template](#venue-messages).

### API

`Location` (class) - Class that allows you to build a location messages with optional custom keyboards.

_Arguments:_

- latutude, number (required) - location latitude.
- longitude, number (required) - location longitude.

### Methods

| Method                   | Required | Arguments                                | Returns                           | Description                              |
| ------------------------ | -------- | ---------------------------------------- | --------------------------------- | ---------------------------------------- |
| Custom Keyboards methods | No       | See [Custom Keyboard](#custom-keyboards) section | `this` for chaining               | See [Custom Keyboard](#custom-keyboards) section |
| get                      | Yes      | No argsuments                            | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Telegram Messenger |

### Example

```javascript
const botBuilder = require('claudia-bot-builder');
const telegramTemplate = botBuilder.telegramTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'telegram')
    return new telegramTemplate.Location(44.831115, 20.421277)
      .get();
});
```



## Venue messages

Venue template allows you to send a venue info, if you want to send a location without a name and address use [Location message template](#location-messages).

### API

`Venue` (class) - Class that allows you to build a venue messages with optional custom keyboards.

_Arguments:_

- latitude, number (required) - location latitude.
- longitude, number (required) - location longitude.
- name, string (required) - venue name.
- address, string (required) - venue address.

### Methods

| Method                   | Required | Arguments                                | Returns                           | Description                              |
| ------------------------ | -------- | ---------------------------------------- | --------------------------------- | ---------------------------------------- |
| Custom Keyboards methods | No       | See [Custom Keyboard](#custom-keyboards) section | `this` for chaining               | See [Custom Keyboard](#custom-keyboards) section |
| get                      | Yes      | No arguments                             | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Telegram Messenger |

### Example

```javascript
const botBuilder = require('claudia-bot-builder');
const telegramTemplate = botBuilder.telegramTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'telegram')
    return new telegramTemplate.Venue(44.831115, 20.421277, 'Lemon Chili', 'Zemun Quay, Belgrade, Serbia')
      .get();
});

```



## Sticker messages

Sticker template allows you to send a Telegram sticker.

### API

`Sticker` (class) - Class that allows you to build sticker messages with optional custom keyboards.

_Arguments:_

- sticker, string (required) - an url (.webp sticker) or an ID of already uploaded sticker.

### Methods

| Method                   | Required | Arguments                                | Returns                           | Description                              |
| ------------------------ | -------- | ---------------------------------------- | --------------------------------- | ---------------------------------------- |
| Custom Keyboards methods | No       | See [Custom Keyboard](#custom-keyboards) section | `this` for chaining               | See [Custom Keyboard](#custom-keyboards) section |
| get                      | Yes      | No arguments                             | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Telegram Messenger |

### Example

```javascript
const botBuilder = require('claudia-bot-builder');
const telegramTemplate = botBuilder.telegramTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'telegram')
    return new telegramTemplate.Sticker('http://example.com/stickers/sticker.webp').get();
});
```



## Contact messages

Contact template allows you to share contact's first name, last name and phone number.

### API

`Contact` (class) - Class that allows you to build contact messages with optional custom keyboards.

_Arguments:_

- phone, string (required) - contacts phone number.
- firstName, string (required) - contacts first name.
- lastName, string (optional) - contacts last name.

### Methods

| Method                   | Required | Arguments                                | Returns                           | Description                              |
| ------------------------ | -------- | ---------------------------------------- | --------------------------------- | ---------------------------------------- |
| Custom Keyboards methods | No       | See [Custom Keyboard](#custom-keyboards) section | `this` for chaining               | See [Custom Keyboard](#custom-keyboards) section |
| get                      | Yes      | No arguments                             | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Telegram Messenger |

### Example

```javascript
const botBuilder = require('claudia-bot-builder');
const telegramTemplate = botBuilder.telegramTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'telegram')
    return new telegramTemplate.Contact('123456789', 'John', 'Doe').get()
});
```



## Changing chat action

Sometimes you just want to simulate user actions before sending a real message, ie. typing, uploading, etc. _Claudia Bot Builder_ supports those chat actions.

### API

`ChatAction` (class) - Class that allows you to set a chat action.

_Arguments:_

- action, string (required) - a valid chat action: 'typing', 'upload_photo', 'record_video', 'upload_video', 'record_audio', 'upload_audio', 'upload_document' or 'find_location'. More info in [official docs](https://core.telegram.org/bots/api#sendchataction).

### Methods

| Method | Required | Arguments    | Returns                           | Description                              |
| ------ | -------- | ------------ | --------------------------------- | ---------------------------------------- |
| get    | Yes      | No arguments | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Telegram Messenger |

### Example

```javascript
const botBuilder = require('claudia-bot-builder');
const telegramTemplate = botBuilder.telegramTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'telegram')
    return [
      new telegramTemplate.ChatAction('typing').get(),
      'Hello'
    ];
});
```



## Pause between messages

Sometimes it's good to make a short break when you are sending multiple messages, for that use _Pause_ method.

### API

`Pause` (class) - Class that allows you to set a pause before next message.

_Arguments:_

durations, integer (optional) - a duration in miliseconds, if it's not provided 0.5 seconds will be set automatically.

_Note:_ This is not the Telegram API method, it's a Claudia Bot Builder method that allows you to build better user experience.

### Methods

| Method | Required | Arguments    | Returns                           | Description                              |
| ------ | -------- | ------------ | --------------------------------- | ---------------------------------------- |
| get    | Yes      | No arguments | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Claudia Bot Builder |

### Example

```javascript
const botBuilder = require('claudia-bot-builder');
const telegramTemplate = botBuilder.telegramTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'telegram')
    return [
      '1',
      new telegramTemplate.Pause(1000).get(),
      '2'
    ];
});
```



## Other attachments

 At the moment, _Claudia Bot Builder_ does not have a full support for all Telegram message types, but you can send any custom message manually.

Here's how it works:

1. If you send simple text we'll wrap it in required format and bot will receive simple text message;

2. If you pass the object in format:

   ```js
   {
     text: 'Some text',
     parse_mode: 'Markdown',
     reply_markup: JSON.stringify({ keyboard: [
       ['First Button'], ['Second Button']],
       resize_keyboard: true,
       one_time_keyboard: true
     })
   }
   ```

   or anything else supported by Telegram (check [the API here](https://core.telegram.org/bots/api#sendmessage)) we'll send that to the bot and just append chat id if you don't want to overwrite it.

3. If you send a message in format:

   ```js
   {
     method: 'sendMessage',
     body: {}
   }
   ```

   it'll do the same thing as step 2 for `reply.body` but it'll also allow you to overwrite reply method, ie. to send a message instead of answering as inline query, or to send video, file, etc.

## Sending multiple messages

It's easy to send multiple messages, just pass an array with at least one of the methods mentioned above. You can combine them how ever you want.

### Example

```javascript
const botBuilder = require('claudia-bot-builder');
const telegramTemplate = botBuilder.telegramTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'telegram')
    return [
      new telegramTemplate.ChatAction('typing').get(),
      new telegramTemplate.Pause(200).get(),
      'Hello!',
      new telegramTemplate.ChatAction('typing').get(),
      new telegramTemplate.Pause(400).get(),
      new telegramTemplate.Text(`What's your favorite House in Game Of Thrones`)
        .addReplyKeyboard([['Stark'], ['Lannister'], ['Targaryen'], ['None of the above']])
        .get()
    ];
});
```



## Handling errors

Telegram Template Message builder checks if messages you are generating are following Telegram Messenger guidelines and limits, in case they are not an error will be thrown.

_Example:_

Calling `new telegramTemplate.Text()` without `text` will throw `Text is required for Telegram Text template` error.

All errors that Claudia bot builder's telegramTemplate library is throwing can be found [in the source code](../lib/telegram/format-message.js).

Errors will be logged in Cloud Watch log for your bot.
