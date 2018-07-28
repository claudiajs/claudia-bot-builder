# Facebook Template Message builder

In this guide:

1. [Intro](#intro)
2. [Text messages](#text-messages)
3. [Generic template](#generic-template)
4. [List template](#list-template)
5. [Button template](#button-template)
6. [Receipt template](#receipt-template)
7. [Image attachment](#image-attachment)
8. [Audio attachment](#audio-attachment)
9. [Video attachment](#video-attachment)
10. [File attachment](#file-attachment)
11. [Chat action](#chat-action)
12. [Pause template](#pause-template)
13. [Other attachments](#other-attachments)
14. [Handling errors](#handling-errors)

## Intro

_Facebook Template Message builder_ allows you to generate more complex messages for Facebook Messenger without writing JSON files manually.

To use it, just require `fbTemplate` function from _Claudia Bot Builder_:

```js
const fbTemplate = require('claudia-bot-builder').fbTemplate;
```

`fbTemplate` exports an object that contains multiple classes that allows you to generate different types of Facebook Messenger structured messages:

- Text messages (this is not template, but we need to have them because of quick answers)
- Generic template messages
- List template messages
- Button template messages
- Receipt template messages
- Image attachment messages
- Audio attachment messages
- Video attachment messages
- File attachment messages

More info about each type of structured messages can be found in [Facebook Messenger's Complete guide](https://developers.facebook.com/docs/messenger-platform/implementation#send_message).

## Text messages

Text messages returns a simple text. In case you don't need to add quick responses reply with a simple text and _Cluaudia Bot Builder_ will do the rest.

However, if you want to add quick replies check the class below.

### API

`Text` (class) - Class that allows you to build text messages with quick replies  

_Note:_ Claudia bot builders versions < 2.1 have just a lower case class `text`, same method works for versions >= 2.1, but it's deprecated and it will be removed in next major version. Text must be UTF-8 and has a 640 character limit.


_Arguments_:

- `text`, string (required) - a simple text to send as a reply.

### Methods

| Method        | Required | Arguments                                | Returns                           | Description                              |
| ------------- | -------- | ---------------------------------------- | --------------------------------- | ---------------------------------------- |
| addQuickReply | No       | title (string, required, up to 20 characters), payload (string, required) - up to 1000 characters, image (string, optional, valid url) - an url of an icon, can be transparent and it should be at least 24x24px | `this` for chaining               | Facebook allows us to send up to 11 quick replies that will appear above the keyboard |
| addQuickReplyLocation | No       | No args. | `this` for chaining               | Same as above, just asks user for a current location |
| setNotificationType | No       | type (string, one of `REGULAR`, `SILENT_PUSH` or `NO_PUSH`) | `this` for chaining               | REGULAR will emit a sound/vibration and a phone notification; SILENT_PUSH will just emit a phone notification, NO_PUSH will not emit either
| setMessagingType | Yes*      | type (string, one of `RESPONSE`, `UPDATE`, or `MESSAGE_TAG`) | `this` for chaining               | Beginning May 7, 2018, this property will be required for all message sends. Note `messaging_type` is set to 'RESPONSE' by default |
| setMessageTag | No | tag (string, one of `COMMUNITY_ALERT`, `CONFIRMED_EVENT_REMINDER`, `NON_PROMOTIONAL_SUBSCRIPTION`, `PAIRING_UPDATE`, `APPLICATION_UPDATE`, `ACCOUNT_UPDATE`, `PAYMENT_UPDATE`, `PERSONAL_FINANCE_UPDATE`, `SHIPPING_UPDATE`, `RESERVATION_UPDATE`,`ISSUE_RESOLUTION`, `APPOINTMENT_UPDATE`, `GAME_EVENT`, `TRANSPORTATION_UPDATE`, `FEATURE_FUNCTIONALITY_UPDATE`, `TICKET_UPDATE`) | `this` for chaining               | Please see the [Facebook Developer's Guide for more info](https://developers.facebook.com/docs/messenger-platform/send-messages/message-tags)
| get           | Yes      | No args.                                 | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Facebook Messenger |

### Example

```js
const botBuilder = require('claudia-bot-builder');
const fbTemplate = botBuilder.fbTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'facebook') {
    const newMessage = new fbTemplate.Text('What\'s your favorite House in Game Of Thrones');

    return newMessage
      .addQuickReply('Stark', 'STARK')
      .addQuickReply('Lannister', 'LANNISTER')
      .addQuickReply('Targaryen', 'TARGARYEN')
      .addQuickReply('None of the above', 'OTHER')
      .get();
  }
});
```

_How it looks:_

![Text with quick replies](https://claudiajs.com/assets/facebook/text_with_quick_replies.png)

## Generic template

The Generic Template can take an image, title, subtitle, description and buttons. This template can support multiple bubbles per message and display them as a horizontal list.

### API

`Generic` (class) - Class that allows you to build Generic template messages  

_Note:_ Claudia bot builders versions < 2.1 have just a lower case class `generic`, same method works for versions >= 2.1, but it's deprecated and it will be removed in next major version.


_Arguments_:

- none

### Methods

| Method        | Required | Arguments                                | Returns             | Description                              |
| ------------- | -------- | ---------------------------------------- | ------------------- | ---------------------------------------- |
| useSquareImages     | No       | No args. | `this` for chaining | By default images in generic template are in horizontal (1:1.91) ration, this method will set the ratio to 1:1 |
| addBubble     | Yes      | title (string, required), subtitle (string) | `this` for chaining | Each Generic template can have 1 to 10 elements/bubbles, before you add anything to it. It requires element's title, but it can also accept element's subtitle |
| addUrl        | No       | A valid URL                              | `this` for chaining | Adds an url to a current element, requires a valid URL, also requires `addBubble` to be added first |
| addImage      | No       | A valid absolute URL                     | `this` for chaining | Adds an image to a current element, requires a valid URL, also requires `addBubble` to be added first |
| addDefaultAction | No       | A valid URL                              | `this` for chaining | Adds an default action url to a current element, requires a valid URL, also requires `addBubble` to be added first |
| addButton     | Yes, at least one of the button types | title (string, required), value (required, string or a valid URL) | `this` for chaining | Adds a button to a current element, each button requires a title and a value, where value can be any string if you want `postback` type or a valid URL if you want it's type to be `web_url`, at least one button is required, and maximum 3 of them is allowed. It also requires `addBubble` to be added first |
| addCallButton | Yes, at least one of the button types | title (string, required), phoneNumber (required, string in '+1234...' format) | `this` for chaining | Adds a call button, check [official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/call-button) for more info |
| addShareButton | Yes, at least one of the button types | No args. | `this` for chaining | Adds a share button, check [official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/share-button) for more info |
| addBuyButton | Yes, at least one of the button types | title (string, required), value (required, string), paymentSummary (required, object, check [official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/buy-button) for more info) | `this` for chaining | Adds a share button, check [official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/buy-button) for more info |
| addLoginButton | Yes, at least one of the button types | url (required, a valid URL) | `this` for chaining | Adds a login button, check [official docs](https://developers.facebook.com/docs/messenger-platform/account-linking/link-account) for more info |
| addLogoutButton | Yes, at least one of the button types | No args. | `this` for chaining | Adds a logout button, check [official docs](https://developers.facebook.com/docs/messenger-platform/account-linking/unlink-account) for more info |
| addQuickReply | No       | title (string, required, up to 20 characters), payload (string, required), up to 1000 characters | `this` for chaining | Facebook allows us to send up to 10 quick replies that will appear above the keyboard |
| setNotificationType | No       | type (string, one of `REGULAR`, `SILENT_PUSH` or `NO_PUSH`) | `this` for chaining               | REGULAR will emit a sound/vibration and a phone notification; SILENT_PUSH will just emit a phone notification, NO_PUSH will not emit either
| get           | Yes      | No args.                                 | Formatted JSON      | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Facebook Messenger |

*_Required arguments_, Messenger requires all elements to have those values, the message builder will throw an error if you don't provide it.

### Example

```js
const botBuilder = require('claudia-bot-builder');
const fbTemplate = botBuilder.fbTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'facebook') {
    const generic = new fbTemplate.Generic();

    return generic
      .addBubble('Claudia.js', 'Deploy Node.js microservices to AWS easily')
        .addUrl('https://claudiajs.com')
        .addImage('https://claudiajs.com/assets/claudiajs.png')
        .addDefaultAction('https://claudiajs.com')
        .addButton('Say hello', 'HELLO')
        .addButton('Go to Github', 'https://github.com/claudiajs/claudia')
      .addBubble('Claudia Bot Builder')
      	.addImage('https://claudiajs.com/assets/claudia-bot-builder-video.jpg')
      	.addButton('Go to Github', 'https://github.com/claudiajs/claudia-bot-builder')
      .get();
  }
});
```

_How it looks:_

![Text with quick replies](https://claudiajs.com/assets/facebook/generic.png)

## List template

The List Template can take an image, title, subtitle, description and buttons. This template can support multiple bubbles per message and display them as a horizontal list.

### API

`List` (class) - Class that allows you to build List template messages  


_Arguments_:

- `topElementStyle`, string (required for `compact`) - style of List template you want to send. Defaults to `large`.

### Methods

| Method        | Required | Arguments                                | Returns             | Description                              |
| ------------- | -------- | ---------------------------------------- | ------------------- | ---------------------------------------- |
| addBubble     | Yes      | title (string, required), subtitle (string) | `this` for chaining | Each List template can have 2 to 4 elements/bubbles, before you add anything to it. It requires element's title, but it can also accept element's subtitle |
| addDefaultAction | No       | A valid URL                              | `this` for chaining | Adds an default action url to a current element, requires a valid URL, also requires `addBubble` to be added first |
| addImage      | No       | A valid absolute URL                     | `this` for chaining | Adds an image to a current element, requires a valid URL, also requires `addBubble` to be added first |
| addButton     | No      | title (string, required), value (required, string or a valid URL) | `this` for chaining | Adds a button to a current element, button requires a title and a value, where value can be any string if you want `postback` type or a valid URL if you want it's type to be `web_url`, maximum 1 is allowed. It also requires `addBubble` to be added first |
| addListButton | No      | title (string, required), value (required, string or a valid URL) | `this` for chaining | Adds a button to a List element, button requires a title and a value, where value can be any string if you want `postback` type or a valid URL if you want it's type to be `web_url`, maximum 1 is allowed. |
| addQuickReply | No       | title (string, required, up to 20 characters), payload (string, required), up to 1000 characters | `this` for chaining | Facebook allows us to send up to 10 quick replies that will appear above the keyboard |
| setNotificationType | No       | type (string, one of `REGULAR`, `SILENT_PUSH` or `NO_PUSH`) | `this` for chaining               | REGULAR will emit a sound/vibration and a phone notification; SILENT_PUSH will just emit a phone notification, NO_PUSH will not emit either
| get           | Yes      | No args.                                 | Formatted JSON      | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Facebook Messenger |

*_Required arguments_, Messenger requires all elements to have those values, the message builder will throw an error if you don't provide it.

### Example

```js
const botBuilder = require('claudia-bot-builder');
const fbTemplate = botBuilder.fbTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'facebook') {
    const list = new fbTemplate.List();

    return list
      .addBubble('Claudia.js', 'Deploy Node.js microservices to AWS easily')
        .addImage('https://claudiajs.com/assets/claudiajs.png')
        .addDefaultAction('https://github.com/claudiajs/claudia-bot-builder')
        .addButton('Say hello', 'HELLO')
      .addBubble('Claudia Bot Builder')
      	.addImage('https://claudiajs.com/assets/claudia-bot-builder-video.jpg')
      	.addButton('Go to Github', 'https://github.com/claudiajs/claudia-bot-builder')
      .addListButton('Contact us if you like it', 'https://claudiajs.com')
      .get();
  }
});
```

## Button template

The Button Template is useful when you want to present simple text with options, it has the same buttons as Generic template, but it doesn't allow element image and URL, it also doesn't allow multiple elements.

### API

`Button` (class) - Class that allows you to build Button template messages  

_Note:_ Claudia bot builders versions < 2.1 have just a lower case class `button`, same method works for versions >= 2.1, but it's deprecated and it will be removed in next major version.


_Arguments_:

- `text`, string (required) - a text to display above the button(s).

### Methods

| Method        | Required | Arguments                                | Returns             | Description                              |
| ------------- | -------- | ---------------------------------------- | ------------------- | ---------------------------------------- |
| addButton     | Yes, at least one of the button types | title (string, required), value (required, string or a valid URL) | `this` for chaining | Adds a button to a current element, each button requires a title and a value, where value can be any string if you want `postback` type or a valid URL if you want it's type to be `web_url`, at least one button is required, and maximum 3 of them is allowed |
| addCallButton | Yes, at least one of the button types | title (string, required), phoneNumber (required, string in '+1234...' format) | `this` for chaining | Adds a call button, check [official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/call-button) for more info |
| addShareButton | Yes, at least one of the button types | No args. | `this` for chaining | Adds a share button, check [official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/share-button) for more info |
| addBuyButton | Yes, at least one of the button types | title (string, required), value (required, string), paymentSummary (required, object, check [official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/buy-button) for more info) | `this` for chaining | Adds a share button, check [official docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference/buy-button) for more info |
| addLoginButton | Yes, at least one of the button types | url (required, a valid URL) | `this` for chaining | Adds a login button, check [official docs](https://developers.facebook.com/docs/messenger-platform/account-linking/link-account) for more info |
| addLogoutButton | Yes, at least one of the button types | No args. | `this` for chaining | Adds a logout button, check [official docs](https://developers.facebook.com/docs/messenger-platform/account-linking/unlink-account) for more info |
| addQuickReply | No       | title (string, required, up to 20 characters), payload (string, required), up to 1000 characters | `this` for chaining | Facebook allows us to send up to 10 quick replies that will appear above the keyboard |
| setNotificationType | No       | type (string, one of `REGULAR`, `SILENT_PUSH` or `NO_PUSH`) | `this` for chaining               | REGULAR will emit a sound/vibration and a phone notification; SILENT_PUSH will just emit a phone notification, NO_PUSH will not emit either
| get           | Yes      | No args.                                 | Formatted JSON      | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Facebook Messenger |

*_Required arguments_, Messenger requires all elements to have those values, the message builder will throw an error if you don't provide it.

### Example

```
const botBuilder = require('claudia-bot-builder');
const fbTemplate = botBuilder.fbTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'facebook') {
    return new fbTemplate.Button('How are you?')
      .addButton('Awesome', 'AWESOME')
      .addButton('Great', 'GREAT')
      .addButton('🎵🎵🎵', 'https://youtu.be/m5TwT69i1lU')
      .get();
  }
});
```

_How it looks:_

![Text with quick replies](https://claudiajs.com/assets/facebook/button.png)

## Receipt template

The Receipt Template can be used to send receipts for orders.

### API

`Receipt` (class) - Class that allows you to build Receipt template messages  

_Note:_ Claudia bot builders versions < 2.1 have just a lower case class `receipt`, same method works for versions >= 2.1, but it's deprecated and it will be removed in next major version.


_Arguments_:

- `name`, string (required) - recipient's Name
- `orderNumber`, string (required) - order number, must be unique
- `currency`, string (required) - currency for order, FB requires valid ISO 4217 currency code, for the list of valid codes check [ISO 4217 page on Wikipedia](https://en.wikipedia.org/wiki/ISO_4217#Active_codes).
- `paymentMethod`, string (required) - payment method details, this can be a custom string. ex: 'Visa 1234'

- `text`, string (required) - a text to display above the button(s).

### Methods

| Method             | Required          | Arguments                                | Returns             | Description                              |
| ------------------ | ----------------- | ---------------------------------------- | ------------------- | ---------------------------------------- |
| addTimestamp       | No                | timestamp (valid JS date object, required) | `this` for chaining | timestamp of the order                   |
| addOrderUrl        | No                | url (valid URL, required)                | `this` for chaining | order URL                                |
| addItem            | Yes, at least one | title (string, required)                 | `this` for chaining | add an item to a receipt, at least one item is required. Beside title, each item can have subtitle, quantity, price, currencty and image, methods bellow explains how to add them |
| addSubtitle        | No                | subtitle (string, required)              | `this` for chaining | current item's subtitle, requires `addItem` first |
| addQuantity        | No                | quantity (number, required)              | `this` for chaining | current item's quantity, requires `addItem` first |
| addPrice           | No                | price (number, required)                 | `this` for chaining | current item's price, requires `addItem` first |
| addCurrency        | No                | currency (string, required)              | `this` for chaining | current item's currency, requires `addItem` first |
| addImage           | No                | image (string, required)                 | `this` for chaining | current item's image, requires `addItem` first and accepts valid absolute urls only |
| addShippingAddress | No                | street1 (string, required), street2 (string, can be `null`), city (string, required), zip (string, required), state (string, required), country (string, required) | `this` for chaining | shipping address if applicable           |
| addAdjustment      | No                | name (string), amount (number)           | `this` for chaining | payment adjustments, multiple adjustments are allowed |
| addSubtotal        | No                | subtotal (number, required)              | `this` for chaining | subtotal                                 |
| addShippingCost    | No                | shippingCost (number, required)          | `this` for chaining | shipping cost                            |
| addTax             | No                | tax (number, required)                   | `this` for chaining | total tax                                |
| addTotal           | Yes               | total (number, required)                 | `this` for chaining | total cost                               |
| addQuickReply      | No                | title (string, required, up to 20 characters), payload (string, required), up to 1000 characters | `this` for chaining | Facebook allows us to send up to 10 quick replies that will appear above the keyboard |
| setNotificationType | No       | type (string, one of `REGULAR`, `SILENT_PUSH` or `NO_PUSH`) | `this` for chaining               | REGULAR will emit a sound/vibration and a phone notification; SILENT_PUSH will just emit a phone notification, NO_PUSH will not emit either
| get                | Yes               | No args.                                 | Formatted JSON      | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Facebook Messenger |

### Example

```js
const botBuilder = require('claudia-bot-builder');
const fbTemplate = botBuilder.fbTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'facebook') {
    return new fbTemplate.Receipt('Stephane Crozatier', '12345678902', 'USD', 'Visa 2345')
      .addTimestamp(new Date(1428444852))
      .addOrderUrl('http://petersapparel.parseapp.com/order?order_id=123456')
      .addItem('Classic White T-Shirt')
        .addSubtitle('100% Soft and Luxurious Cotton')
        .addQuantity(2)
        .addPrice(50)
        .addCurrency('USD')
        .addImage('http://petersapparel.parseapp.com/img/whiteshirt.png')
      .addItem('Classic Gray T-Shirt')
        .addSubtitle('100% Soft and Luxurious Cotton')
        .addQuantity(1)
        .addPrice(25)
        .addCurrency('USD')
        .addImage('http://petersapparel.parseapp.com/img/grayshirt.png')
      .addShippingAddress('1 Hacker Way', '', 'Menlo Park', '94025',  'CA', 'US')
      .addSubtotal(75.00)
      .addShippingCost(4.95)
      .addTax(6.19)
      .addTotal(56.14)
      .addAdjustment('New Customer Discount', 20)
      .addAdjustment('$10 Off Coupon', 10)
      .get();
  }
});
```

_How it looks:_

![Text with quick replies](https://claudiajs.com/assets/facebook/receipt.png)

## Image attachment

Image attachment allows you to send, obviously, an image :)

### API

`Image` (class) - Class that allows you to send an image attachment message  

_Note:_ Claudia bot builders versions < 2.1 have just a lower case class `image`, same method works for versions >= 2.1, but it's deprecated and it will be removed in next major version.


_Arguments_:

- `url`, string (required) - a valid absolute URL for an image.

### Methods

| Method        | Required | Arguments                                | Returns                           | Description                              |
| ------------- | -------- | ---------------------------------------- | --------------------------------- | ---------------------------------------- |
| addQuickReply | No       | title (string, required, up to 20 characters), payload (string, required), up to 1000 characters | `this` for chaining               | Facebook allows us to send up to 10 quick replies that will appear above the keyboard |
| setNotificationType | No       | type (string, one of `REGULAR`, `SILENT_PUSH` or `NO_PUSH`) | `this` for chaining               | REGULAR will emit a sound/vibration and a phone notification; SILENT_PUSH will just emit a phone notification, NO_PUSH will not emit either
| get           | Yes      | No args.                                 | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Facebook Messenger |

### Example

```js
const botBuilder = require('claudia-bot-builder');
const fbTemplate = botBuilder.fbTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'facebook') {
    return new fbTemplate
      .Image('https://claudiajs.com/assets/claudiajs.png')
      .get();
  }
});
```

_How it looks:_

![Text with quick replies](https://claudiajs.com/assets/facebook/image.png)

## Audio attachment

Audio attachment allows you to send audio files.

### API

`Audio` (class) - Class that allows you to send an audio attachment message  

_Note:_ Claudia bot builders versions < 2.1 have just a lower case class `audio`, same method works for versions >= 2.1, but it's deprecated and it will be removed in next major version.


_Arguments_:

- `url`, string (required) - a valid absolute URL for an audio file.

### Methods

| Method        | Required | Arguments                                | Returns                           | Description                              |
| ------------- | -------- | ---------------------------------------- | --------------------------------- | ---------------------------------------- |
| addQuickReply | No       | title (string, required, up to 20 characters), payload (string, required), up to 1000 characters | `this` for chaining               | Facebook allows us to send up to 10 quick replies that will appear above the keyboard |
| setNotificationType | No       | type (string, one of `REGULAR`, `SILENT_PUSH` or `NO_PUSH`) | `this` for chaining               | REGULAR will emit a sound/vibration and a phone notification; SILENT_PUSH will just emit a phone notification, NO_PUSH will not emit either
| get           | Yes      | No args.                                 | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Facebook Messenger |

### Example

```js
const botBuilder = require('claudia-bot-builder');
const fbTemplate = botBuilder.fbTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'facebook') {
    return new fbTemplate
      .Audio('http://www.noiseaddicts.com/samples_1w72b820/4927.mp3')
      .get();
  }
});
```

_How it looks:_

![Text with quick replies](https://claudiajs.com/assets/facebook/audio.png)

## Video attachment

Video attachment allows you to send video files.

### API

`Video` (class) - Class that allows you to send an video attachment message  

_Note:_ Claudia bot builders versions < 2.1 have just a lower case class `video`, same method works for versions >= 2.1, but it's deprecated and it will be removed in next major version.


_Arguments_:

- `url`, string (required) - a valid absolute URL for a video.

### Methods

| Method        | Required | Arguments                                | Returns                           | Description                              |
| ------------- | -------- | ---------------------------------------- | --------------------------------- | ---------------------------------------- |
| addQuickReply | No       | title (string, required, up to 20 characters), payload (string, required), up to 1000 characters | `this` for chaining               | Facebook allows us to send up to 10 quick replies that will appear above the keyboard |
| setNotificationType | No       | type (string, one of `REGULAR`, `SILENT_PUSH` or `NO_PUSH`) | `this` for chaining               | REGULAR will emit a sound/vibration and a phone notification; SILENT_PUSH will just emit a phone notification, NO_PUSH will not emit either
| get           | Yes      | No args.                                 | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Facebook Messenger |

### Example

```js
const botBuilder = require('claudia-bot-builder');
const fbTemplate = botBuilder.fbTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'facebook') {
    return new fbTemplate
      .Video('http://techslides.com/demos/sample-videos/small.mp4')
      .get();
  }
});
```

_How it looks:_

![Text with quick replies](https://claudiajs.com/assets/facebook/video.png)

## File attachment

File attachment allows you to send files.

### API

`File` (class) - Class that allows you to send a file attachment message  

_Note:_ Claudia bot builders versions < 2.1 have just a lower case class `file`, same method works for versions >= 2.1, but it's deprecated and it will be removed in next major version.


_Arguments_:

- `url`, string (required) - a valid absolute URL for a file you want to send.

### Methods

| Method        | Required | Arguments                                | Returns                           | Description                              |
| ------------- | -------- | ---------------------------------------- | --------------------------------- | ---------------------------------------- |
| addQuickReply | No       | title (string, required, up to 20 characters), payload (string, required), up to 1000 characters | `this` for chaining               | Facebook allows us to send up to 10 quick replies that will appear above the keyboard |
| setNotificationType | No       | type (string, one of `REGULAR`, `SILENT_PUSH` or `NO_PUSH`) | `this` for chaining               | REGULAR will emit a sound/vibration and a phone notification; SILENT_PUSH will just emit a phone notification, NO_PUSH will not emit either
| get           | Yes      | No args.                                 | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Facebook Messenger |

### Example

```js
const botBuilder = require('claudia-bot-builder');
const fbTemplate = botBuilder.fbTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'facebook') {
    return new fbTemplate
      .File('https://claudiajs.com/assets/claudiajs.png')
      .get();
  }
});
```

_How it looks:_

![Text with quick replies](https://claudiajs.com/assets/facebook/image.png)

## Chat action

Sometimes you just want to simulate user actions before sending a real message, ie. typing, mark message as seen, etc. _Claudia Bot Builder_ supports those chat actions.

### API

`ChatAction` (class) - Class that allows you to set a chat action.

Arguments:

- `action`, string (required) - a valid chat action: 'typing_on', 'typing_off' or 'mark_seen'.

### Methods

| Method        | Required | Arguments                                | Returns                           | Description                              |
| ------------- | -------- | ---------------------------------------- | --------------------------------- | ---------------------------------------- |
| get           | Yes      | No args.                                 | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Facebook Messenger |

### Example

```js
const botBuilder = require('claudia-bot-builder');
const fbTemplate = botBuilder.fbTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'facebook') {
    return new fbTemplate
      .ChatAction('mark_seen')
      .get()
  }
});
```

## Pause template

Sometimes it's good to make a short break when you are sending multiple messages, for that use Pause method.

### API

`Pause` (class) - Class that allows you to set a pause before next message.

Arguments:

- `duration`, integer (optional) - a duration in milliseconds, if it's not provided 0.5 seconds will be set automatically.

_Note:_ This is not the Facebook API method, it's a Claudia Bot Builder method that allows you to build better user experience.

### Methods

| Method        | Required | Arguments                                | Returns                           | Description                              |
| ------------- | -------- | ---------------------------------------- | --------------------------------- | ---------------------------------------- |
| get           | Yes      | No args.                                 | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Facebook Messenger |

### Example

```js
const botBuilder = require('claudia-bot-builder');
const fbTemplate = botBuilder.fbTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'facebook') {
    return [
      new fbTemplate.ChatAction('typing_on').get(),
      new fbTemplate.Pause(1000).get(),
      'Hello!'
    ]
  }
});
```

## Other attachments

Beside those, Facebook Messenger now supports a few other templates that are not so useful for the common bots, ie. Airline templates.

You can use all those templates by simply providing an object (just a message part, without recipient) instead of a template builder class.

An example:

```javascript
const botBuilder = require('claudia-bot-builder');

module.exports = botBuilder(message => {
  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: [{
          title: 'Breaking News: Record Thunderstorms',
          subtitle: 'The local area is due for record thunderstorms over the weekend.',
          image_url: 'https://media.xiph.org/BBB/BBB-360-png/big_buck_bunny_01542.png',
          buttons: [{
            type: 'element_share'
          }]
        }]
      }
    }
  };
});
```

_How it looks:_

![Text with quick replies](https://claudiajs.com/assets/facebook/other.png)

## Handling errors

_Facebook Template Message builder_ checks if the messages you are generating are following Facebook Messenger guidelines and limits, in case they are not an error will be thrown.

_Example:_

Calling `new fbTemplate.text()`  without text will throw `Text is required for text template` error.

More info about limits and guidelines can be found in [Messenger's Send API Referece](https://developers.facebook.com/docs/messenger-platform/send-api-reference).

All errors that Claudia bot builder's fbTemplate library is throwing can be found [in the source code](../lib/facebook/format-message.js).

Errors will be logged in Cloud Watch log for your bot.
