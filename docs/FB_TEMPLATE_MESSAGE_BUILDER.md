# Facebook Template Message builder

_Facebook Template Message builder_ allows you to generate more complex messages for Facebook Messenger without writing JSON files manually.

To use it, just require `fbTemplate` function from _Claudia Bot Builder_:

```js
const fbTemplate = require('claudia-bot-builder').fbTemplate;
```

`fbTemplate` exports an object that contains 4 classes that allows you to generate 5 different types of Facebook Messenger structured messages:

- Text messages (this is not template, but we need to have them because of quick answers)
- Generic template messages
- Button template messages
- Receipt template messages
- Image attachment messages

More info about each type of structured messages can be found in [Facebook Messenger's Complete guide](https://developers.facebook.com/docs/messenger-platform/implementation#send_message).

## Text messages

Text messages returns a simple text. In case you don't need to add quick responses reply with a simple text and _Cluaudia Bot Builder_ will do the rest.

### API

`text` (class) - Class that allows you to build text messages with quick replies  
_Arguments_:

- `text`, string (required) - a simple text to send as a reply.

### Methods

| Method    | Required | Arguments   | Returns             | Description |
|-----------|----------|-------------|---------------------|-------------|
| addQuickReply | No   | title (string, required, up to 20 characters), payload (string, required), up to 1000 characters | `this` for chaining | Facebook allows us to send up to 10 quick replies that will appear above the keyboard |
| get | Yes | No args. | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Facebook Messenger |

### Example

```js
const botBuilder = require('claudia-bot-builder');
const fbTemplate = botBuilder.fbTemplate;

module.exports = botBuilder(request => {
  if (request.type === 'facebook') {
    const message = new fbTemplate.text('What\'s your favorite House in Game Of Thrones');
    
    return message
      .addQuickReply('Stark', 'STARK')
      .addQuickReply('Lannister', 'LANNISTER')
      .addQuickReply('Targaryen', 'TARGARYEN')
      .addQuickReply('None of the above', 'OTHER')
      .get();
  }
});
```

## Generic template

The Generic Template can take an image, title, subtitle, description and buttons. This template can support multiple bubbles per message and display them as a horizontal list.

### API

`generic` (class) - Class that allows you to build Generic template messages  
_Arguments_:

- none

### Methods

| Method    | Required | Arguments   | Returns             | Description |
|-----------|----------|-------------|---------------------|-------------|
| addBubble | Yes      | title (string, required), subtitle (string)    | `this` for chaining | Each Generic template can have 1 to 10 elements/bubbles, before you add anything to it. It requires element's title, but it can also accept element's subtitle |
| addUrl    | No       | A valid URL | `this` for chaining | Adds an url to a current element, requires a valid URL, also requires `addBubble` to be added first |
| addImage  | No       | A valid URL | `this` for chaining | Adds an image to a current element, requires a valid URL, also requires `addBubble` to be added first |
| addButton | Yes      | title (string, required), value (required, string or a valid URL) | `this` for chaining | Adds a button to a current element, each button requires a title and a value, where value can be any string if you want `postback` type or a valid URL if you want it's type to be `web_url`, at least one button is required, and maximum 3 of them is allowed. It also requires `addBubble` to be added first |
| addQuickReply | No   | title (string, required, up to 20 characters), payload (string, required), up to 1000 characters | `this` for chaining | Facebook allows us to send up to 10 quick replies that will appear above the keyboard |
| get       | Yes      | No args.    | Formatted JSON      | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Facebook Messenger |

*_Required arguments_, Messenger requires all elements to have those values, the message builder will throw an error if you don't provide it.

### Example

```js
const botBuilder = require('claudia-bot-builder');
const fbTemplate = botBuilder.fbTemplate;

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

## Button template

The Button Template is useful when you want to present simple text with options, it has the same buttons as Generic template, but it doesn't allow element image and URL, it also doesn't allow multiple elements.

### API

`generic` (class) - Class that allows you to build Button template messages  
_Arguments_:

- `text`, string (required) - a text to display above the button(s).

### Methods

| Method    | Required | Arguments   | Returns             | Description |
|-----------|----------|-------------|---------------------|-------------|
| addButton | Yes      | title (string, required), value (required, string or a valid URL) | `this` for chaining | Adds a button to a current element, each button requires a title and a value, where value can be any string if you want `postback` type or a valid URL if you want it's type to be `web_url`, at least one button is required, and maximum 3 of them is allowed |
| addQuickReply | No   | title (string, required, up to 20 characters), payload (string, required), up to 1000 characters | `this` for chaining | Facebook allows us to send up to 10 quick replies that will appear above the keyboard |
| get       | Yes      | No args.    | Formatted JSON      | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Facebook Messenger |

*_Required arguments_, Messenger requires all elements to have those values, the message builder will throw an error if you don't provide it.

### Example

```
const botBuilder = require('claudia-bot-builder');
const fbTemplate = botBuilder.fbTemplate;

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

## Receipt template

The Receipt Template can be used to send receipts for orders.

### API

`receipt` (class) - Class that allows you to build Receipt template messages  
_Arguments_:

- `name`, string (required) - recipient's Name
- `orderNumber`, string (required) - order number, must be unique
- `currency`, string (required) - currency for order
- `paymentMethod`, string (required) - payment method details, this can be a custom string. ex: 'Visa 1234'

- `text`, string (required) - a text to display above the button(s).

### Methods

| Method    | Required | Arguments   | Returns             | Description |
|-----------|----------|-------------|---------------------|-------------|
| addTimestamp | No    | timestamp (valid JS date object, required) | `this` for chaining | timestamp of the order |
| addOrderUrl | No     | url (valid URL, required) | `this` for chaining | order URL |
| addItem   | Yes, at least one | title (string, required) | `this` for chaining | add an item to a receipt, at least one item is required. Beside title, each item can have subtitle, quantity, price, currencty and image, methods bellow explains how to add them |
| addSubtitle | No    | subtitle (string, required) | `this` for chaining | current item's subtitle, requires `addItem` first |
| addQuantity | No    | quantity (number, required) | `this` for chaining | current item's quantity, requires `addItem` first |
| addPrice    | No    | price (number, required) | `this` for chaining | current item's price, requires `addItem` first |
| addCurrency | No    | currency (string, required) | `this` for chaining | current item's currency, requires `addItem` first |
| addImage    | No    | image (string, required) | `this` for chaining | current item's image, requires `addItem` first |
| addShippingAddress | No | street1 (string, required), street2 (string, can be `null`), city (string, required), zip (string, required), state (string, required), country (string, required) | `this` for chaining | shipping address if applicable |
| addAdjustment | No | name (string), amount (number) | `this` for chaining | payment adjustments, multiple adjustments are allowed |
| addSubtotal | No | subtotal (number, required) | `this` for chaining | subtotal |
| addShippingCost | No | shippingCost (number, required) | `this` for chaining | shipping cost |
| addTax | No | tax (number, required) | `this` for chaining | total tax |
| addTotal | Yes | total (number, required) | `this` for chaining | total cost |
| addQuickReply | No   | title (string, required, up to 20 characters), payload (string, required), up to 1000 characters | `this` for chaining | Facebook allows us to send up to 10 quick replies that will appear above the keyboard |
| get | Yes      | No args.    | Formatted JSON      | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Facebook Messenger |

### Example

```js
const botBuilder = require('claudia-bot-builder');
const fbTemplate = botBuilder.fbTemplate;

module.exports = botBuilder(request => {
  if (request.type === 'facebook') {
    return new fbTemplate.receipt('Pizza order', 'ORDER-123', '$', 'Paypal')
      .addTimestamp(new Date())
      .addItem('Pizza')
        .addSubtitle('32cm')
        .addQuantity(1)
        .addPrice(4.99)
      .addShippingAddress('Some street 123', null, 'San Francisco', '123',  'CA', 'US')
      .addTotal(4.99)
      .get();
  }
});

```

## Image attachment

Image attachment allows you to send, obviously, an image :) 

### API

`image` (class) - Class that allows you to send an image attachment message  
_Arguments_:

- `url`, string (required) - a valid URL for an image.

### Methods

| Method    | Required | Arguments   | Returns             | Description |
|-----------|----------|-------------|---------------------|-------------|
| addQuickReply | No   | title (string, required, up to 20 characters), payload (string, required), up to 1000 characters | `this` for chaining | Facebook allows us to send up to 10 quick replies that will appear above the keyboard |
| get | Yes | No args. | Formatted JSON to pass as a reply | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Facebook Messenger |

### Example

```js
const botBuilder = require('claudia-bot-builder');
const fbTemplate = botBuilder.fbTemplate;

module.exports = botBuilder(request => {
  if (request.type === 'facebook') {
    return new fbTemplate.image('https://github.com/claudiajs/claudiajs.com/blob/master/assets/claudiajs.png');
  }
});
```


## Handling errors

_Facebook Template Message builder_ checks if the messages you are generating are following Facebook Messenger guidelines and limits, in case they are not an error will be thrown.

More info about limits and guidelines can be found in [Messenger's Send API Referece](https://developers.facebook.com/docs/messenger-platform/send-api-reference).
