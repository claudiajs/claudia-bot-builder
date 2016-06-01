'use strict';

const apiBuilder = require('claudia-api-builder');
const api = new apiBuilder();

const fbSetup = require('./facebook/setup');
const slackSetup = require('./slack/setup');

function logError(err) {
  console.error(err);
}

module.exports = api;

api.onMessage = function (bot) {
  fbSetup(api, bot, logError);
  slackSetup(api, bot, logError);
};

api.get('/', () => 'Ok');
