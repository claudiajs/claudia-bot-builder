/*global describe, it, expect, require */
'use strict';

const formatMessage = require('../../lib/telegram/format-message');

describe('Telegram format message', () => {
  it('should export an object', () => {
    expect(typeof formatMessage).toBe('object');
  });
});
