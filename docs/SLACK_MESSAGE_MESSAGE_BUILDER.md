# Slack Message builder

_Slack Message builder_ allows you to generate more complex messages with attachments and buttons for Slack without writing JSON files manually.

To use it, just require `slackTemplate` function from _Claudia Bot Builder_:

```js
const slackTemplate = require('claudia-bot-builder').slackTemplate;
```

`slackTemplate` is a class that allows you to build different types of Slack attachments and message actions.

More info about the things you can do is available on [Slack's attachments guide](https://api.slack.com/docs/message-attachments).

### API

`slackTemplate` (class) - Class that allows you to build different types of Slack formatted messages  
_Arguments_:

- `text`, string (required) - a simple text to send as a reply.

### Methods

| Method    | Required | Arguments   | Returns             | Description |
|-----------|----------|-------------|---------------------|-------------|
| replaceOriginal | No | value (boolean, required) | `this` for chaining | Used for message actions, tells Slack if message should be a new one or replace the current one |
| disableMarkdown | No | value (boolean, required) | `this` for chaining | Markdown is by default enabled for all fields that allows it, this disables it for everything |
| channelMessage | No | value (boolean, required) | `this` for chaining | By default all slash commands are private, this makes them visible for everyone |
| getLatestAttachment | No | No args. | `this` for chaining | Returns the last attachment, used internally |
| addAttachment | No | callbackId (string, required), fallback (string, optional) | `this` for chaining | Adds an attachment and sets a fallback and callback_id for it |
| addTitle | No | text (string, required), link (url, optional) | `this` for chaining | Adds a title to the latest attachment |
| addText | No | text (string, required) | `this` for chaining | Adds a text to the latest attachment |
| addPretext | No | text (string, required) | `this` for chaining | Adds a pretext to the latest attachment |
| addImage | No | imageUrl (url, required) | `this` for chaining | Adds an image to the latest attachment |
| addThumbnail | No | thumbnailUrl (url, required) | `this` for chaining | Adds a thumbnail image to the latest attachment |
| addAuthor | No | name (string, required), icon (string, optional), link (url, optional) | `this` for chaining | Adds an author for the latest attachment |
| addFooter | No | text (string, required), icon (url, optional) | `this` for chaining | Adds an footer to the latest attachment |
| addColor | No | color (string, required) | `this` for chaining | Adds a custom color for the latest attachment |
| addTimestamp | No | timestamp (Date, required) | `this` for chaining | Adds a timestamp for the latest attachment |
| addField | No | title (string, required), value (string, required), isShort (boolean, optional) | `this` for chaining | Adds a field to the latest attachment |
| addAction | No | text (string, required), name (string, required), value (string, required), style (string, optional) | `this` for chaining | Adds an action button to the latest attachment, you can add up to 5 buttons per attachment, style can be 'primary' or 'danger' |
| addLinkButton | No | text (string, required), url (url, required), style (string, optional) | `this` for chaining | Adds a URL button to the latest attachment, you can add up to 5 buttons per attachment, style can be 'primary' or 'danger' |
| getLatestAction | No | No args. | `this` for chaining | Returns the latest action, for internal use |
| addConfirmation | No | title (string, required), text (string, required), okLabel (string, optional), dismissLabel (string, optional) | `this` for chaining | Adds a confimation popup for the latest action, default labels are 'Ok' and 'Dismiss' |
| get | Yes | No args. | `this` for chaining | Get method is required and it returns a formatted JSON that is ready to be passed as a response to Slack |

### Example

```js
const botBuilder = require('claudia-bot-builder');
const slackTemplate = botBuilder.slackTemplate;

module.exports = botBuilder(request => {
  if (request.type === 'slack') {
    const message = new slackTemplate('This is sample text');
    
    return message
      .addAttachment('A1')
        .addAction('Button 1', 'button', '1')
        .addAction('Button with confirm', 'button', '2')
          .addConfirmation('Ok?', 'This is confirm text', 'Ok', 'Cancel')
        .addAction('Button 3', 'button', '3')
      .get();
  }
});
```

## Handling errors

_Slack Message builder_ checks if the messages you are generating are following Slack guidelines and limits, in case they are not an error will be thrown.

More info about limits and guidelines can be found in [Slack's attachments guide](https://api.slack.com/docs/message-attachments).
