# Slack delayed/multiple reply

Slack allows you to send a reply to a slash command up to 5 times in 30 minutes.  
_Claudia Bot Builder_, since 1.4.0, allows you to package and send delayed responses easily, using the `.slackDelayedReply` helper function. 

The function expects two arguments:

```js
slackDelayedReply(message, response);
```

* `message` &ndash; `object`, the original message received by the bot builder for the primary request
* `response` &ndash; `string` or `object`, the delayed response you want to send. 

The function returns a `Promise` that you can use to chain requests.

The same rules as for normal responses apply, so if you send a string, it will be wrapped into a Slack response format. Send an object to avoid wrapping and use
more advanced Slack features. You can also use the [Slack Message Builder](SLACK_MESSAGE_MESSAGE_BUILDER.md) to create more complex responses easily.

Check out the [Delayed Responses to Slack Slash Commands](https://claudiajs.com/tutorials/slack-delayed-responses.html) tutorial for a detailed walk-through of how to use this feature, and a full working example in the [Example projects](https://github.com/claudiajs/example-projects/tree/master/slack-delayed-response) repository.
