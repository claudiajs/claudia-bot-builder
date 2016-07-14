# Slack delayed/multiple reply

Slack allows you to send a reply to a slash command up to 5 times in 30 minutes.  
_Claudia Bot Builder_ can handle that too, just do the following:

```js
const botBuilder = require('claudia-bot-builder');
// Import slack delayed reply handler
const slackDelayedReply = botBuilder.slackDelayedReply;
// Import lambda from AWS SDK because we need to call the same lambda again
const aws = require('aws-sdk');
const lambda = new aws.Lambda();

const api = botBuilder((message, apiRequest) => {

  // Do anything you want in your lambda as long as you are returning promise
  // And in the end just call the same lambda again before you reply with an immediate reply

  return new Promise((resolve, reject) => {
    let someImmediateReply = 'Hello';
    // Invoke the same lambda again for delayed reply
    lambda.invoke({
			FunctionName: apiRequest.lambdaContext.functionName,
			InvocationType: 'Event',
			Payload: JSON.stringify({
        slackEvent: message
      }),
			Qualifier: apiRequest.lambdaContext.functionVersion
		}, (err, done) => {
      if (err) return reject(err);

      resolve(someImmediateReply);
    });
  })
    .then(someImmediateReply => {
      // Return an immediate reply
      return someImmediateReply
    });

});

// For delayed response intercept an event
api.intercept((event) => {
  // Check if this is the event you sent above, note that `slackEvent` can be anything
  // If you don't return an event it'll be stopped and some other part of
  // the app will never receive it
  if (!event.slackEvent)
    return event;

  // Get the original message
  const originalMessage = event.slackEvent;

  // Do anything you want, ie. delay it for 5 seconds
  return promiseDelay(5 * 1000)
    .then(() => {
      // And invoke the `slackDelayedReply` with original message and reply
      return slackDelayedReply(message, 'Delayed reply');
    })
    // In the end stop the intercepted event
    .then(() => false);
});

// Finally export an api
module.exports = api;
```

Keep in mind you need to create the lambda with `--allow-recursion` option.

Full working example is available in [Example projects](https://github.com/claudiajs/example-projects/tree/master/slack-delayed-response) repository.
