/*global describe, it, expect, require */
var parse = require('../../lib/slack/parse');

describe('Slack parse', () => {
  it('returns nothing if the format is invalid', () => {
    expect(parse('string')).toBeUndefined();
    expect(parse()).toBeUndefined();
    expect(parse(false)).toBeUndefined();
    expect(parse(123)).toBeUndefined();
    expect(parse({})).toBeUndefined();
    expect(parse([1, 2, 3])).toBeUndefined();
  });

  it('returns nothing if the text or user_id are missing', () => {
    expect(parse({user_id: 'tom'})).toBeUndefined();
    expect(parse({text: 'pete'})).toBeUndefined();
  });

  it('returns a parsed object when text and user_id are present', () => {
    var msg = { user_id: 123, text: 'Hello' };
    expect(parse(msg)).toEqual({ sender: 123, text: 'Hello', originalRequest: msg, type: 'slack-slash-command'});
  });
});
