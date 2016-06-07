# Getting started with Claudia Bot Builder

This document outlines how to create and deploy a very simple bot to AWS Lambda using _Claudia Bot Builder_. For detailed information on the API, and how to create more complex bots, see the [API documentation](API.md). 

## Prerequisites

* Node.js 4.3.2
* NPM
* An AWS account with the permissions to create Lambda functions, API Gateway end-points and IAM roles. 
* [Claudia.js](https://claudiajs.com) 1.4.0 or later

## Setting up the AWS credentials

Claudia.js (and the bot builder extension) just uses the standard AWS Node.js SDK, so if you have that configured, there is no additional configuration required. See [Configuring Access Credentials](https://github.com/claudiajs/claudia/blob/master/getting_started.md#configuring-access-credentials) in the Claudia.js getting started guide for more information.

### Creating a simple Facebook bot

1. Create and initialise a new NPM project in an empty directory:

  ```bash
  npm init
  ```

2. Add the `claudia-bot-builder` as a project dependency (`-S` is critically important here, to save the dependency to `package.json`:

  ```bash
  npm install claudia-bot-builder -S
  ```

3. Install `claudia` as a global utility, if you do not have it already:

  ```bash
  npm install claudia -g
  ```

4. Create a file for your bot (for example, `bot.js`)

  ```javascript
  const botBuilder = require('claudia-bot-builder');

  module.exports = botBuilder(request => 
    `Thanks for sending ${request.text}.`
  );
  ```

5. Create a new bot in AWS, and configure it for Facebook Messenger. If you did not use `bot.js` as the name for your bot file, change the `--api-module` argument below accordingly.

  ```bash
  claudia create --region us-east-1 --api-module bot --configure-fb-bot
  ```

6. When prompted fort the page access token, provide the Page access token for your bot. If you do not have one, create a new bot page in Facebook, as explained in the [Facebook Messenger Getting Started Guide](https://developers.facebook.com/docs/messenger-platform/quickstart).

7. The deployment process, when it completes, will print out the bot Web hook URL. You can copy and paste that to your Facebook bot configuration. 

8. All done, talk to your bot from the Facebook page.


### Telegram bot configuration

For getting a Telegram bot access token - use their [BotFather](https://telegram.me/BotFather) bot for creating bots. 

Use `--configure-telegram-bot` when deploying with Claudia to configure the access token in your bot.


### Skype bot configuration

For getting Skype bot credentials:

- Create a Microsoft App and get its App ID and App secret on [Microsoft Apps](https://apps.dev.microsoft.com/)
- Create the Skype bot and use the App ID and App Secret (Private key) on the [Microsoft My Bots](https://developer.microsoft.com/en-us/skype/bots/manage)
- Use `--configure-skype-bot` when deploying with Claudia to configure the access details in your bot.

### Further information

For more information on configuring different bot types, see [API Documentation](API.md).

To learn how to run multiple versions for development and testing, how to package resources and other deployment-related information, see the [Claudia.js Command Line Usage](https://github.com/claudiajs/claudia/tree/master/docs).

For runtime costs, scaling and operational information, see the [AWS Lambda](https://aws.amazon.com/documentation/lambda/) documentation.
