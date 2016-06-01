'use strict';

const test = require('tape');
const botBuilder = require('../lib/bot-builder.js');

test('Test bot builder', t => {
  t.plan(2);

  t.equal(typeof botBuilder.onMessage, 'function', '`botBuilder.onMessage` should be function');

  setTimeout(() => t.ok(true, 'meaningless test just to show how async work'), 200);
});
