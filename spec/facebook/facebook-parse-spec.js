/*global describe, it, expect, require */
var parse = require('../../lib/facebook/parse');
describe('Facebook parse', () => {
  it('returns nothing if the format is invalid', () => {
    expect(parse('string')).toBeUndefined();
    expect(parse()).toBeUndefined();
    expect(parse(false)).toBeUndefined();
    expect(parse(123)).toBeUndefined();
    expect(parse({})).toBeUndefined();
    expect(parse([1, 2, 3])).toBeUndefined();
  });
  it('returns false if the message or sender are missing', () => {
    expect(parse({sender: 'tom'})).toBeUndefined();
    expect(parse({message: 'pete'})).toBeUndefined();
  });
  it('returns a parsed object when there message and sender are present', () => {
    var msg = {sender: {id: 'tom'}, message: { text: 'Hello' }};
    expect(parse(msg, {})).toEqual({ sender: 'tom', text: 'Hello', originalRequest: msg, type: 'facebook'});
  });
  it('returns a parsed object for postback messages', () => {
    var msg = {
      sender: { id: '12345' },
      recipient: { id: '67890' },
      timestamp: 1465558466933,
      postback: { payload: 'POSTBACK' }
    };
    expect(parse(msg)).toEqual({
      sender: '12345',
      text: 'POSTBACK',
      originalRequest: msg,
      postback: true,
      type: 'facebook'
    });
  });
  it('returns a parsed object for a quick reply', () => {
    var msg = {
      sender: { id: '12345' },
      recipient: { id: '67890' },
      timestamp: 1465558466933,
      message: {
        text: 'Some text',
        mid: 'mid.1464990849238:b9a22a2bcb1de31773',
        seq: 69,
        quick_reply: {
          payload: 'QUICK_REPLY'
        }
      }
    };
    expect(parse(msg)).toEqual({
      sender: '12345',
      text: 'Some text',
      originalRequest: msg,
      type: 'facebook'
    });
  });
});
