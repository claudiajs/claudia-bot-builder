/*global describe, it, expect */
'use strict';
var reply = require('../../lib/slack/reply');

describe('Slack Reply', () => {

  it('returns a formatted output if string is passed', () =>
    expect(reply('string')).toEqual({
      text: 'string'
    })
  );

  it('returns the same thing that was passed if argument is not a string', () => {
    expect(reply()).toBeUndefined();
    expect(reply(123)).toBe(123);
    expect(reply([])).toEqual([]);
    expect(reply({})).toEqual({});
    expect(reply({ key: 'value' })).toEqual({ key: 'value' });
  });
});
