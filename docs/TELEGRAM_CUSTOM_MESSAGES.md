# Telegram Custom Messages

At the moment, _Claudia Bot Builder_ does not have a full message builder for Telegram, but you can send custom messages manually.

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
   it'll do the same thing as step 2 for `reply.body` but it'll also allow you to overwrite reply method, ie. to send a message instead of answering as inline query.
