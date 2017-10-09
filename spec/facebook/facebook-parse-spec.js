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
        mid: 'mid.1464990849238:b9a22a2bcb1de31773',
        seq: 69,
        quick_reply: {
          payload: 'QUICK_REPLY'
        }
      }
    };
    expect(parse(msg)).toEqual({
      sender: '12345',
      text: 'QUICK_REPLY',
      originalRequest: msg,
      type: 'facebook',
      postback: true
    });
  });
  it('does not parse the object if it is delivery report', () => {
    var msg = {
      sender: { id: '12345' },
      recipient: { id: '67890' },
      timestamp: 1465558466933,
      delivery: {
        mids: ['mid.1458668856218:ed81099e15d3f4f233'],
        watermark: 1458668856253,
        seq: 37
      }
    };
    expect(parse(msg)).toBeFalsy();
  });
  it('does not parse the object if it is read report', () => {
    var msg = {
      sender: { id: '12345' },
      recipient: { id: '67890' },
      timestamp: 1465558466933,
      read: {
        watermark: 1458668856253,
        seq: 38
      }
    };
    expect(parse(msg)).toBeFalsy();
  });
  it('does not parse the object if it is an echo message', () => {
    var msg = {
      sender: {
        id: '12345'
      },
      recipient: {
        id: '54321'
      },
      timestamp: 1483413621558,
      message: {
        is_echo: true,
        app_id: 314159,
        mid: 'mid.1483413621558:a9dc28cb84',
        seq: 1022,
        text: 'Some text'
      }
    };
    expect(parse(msg)).toBeFalsy();
  });
  it('returns a parsed message for checkbox plugin', () => {
    var msg = {
      recipient: {
        id: '12345'
      },
      timestamp: 1234567890,
      optin: {
        ref:'SomeData',
        user_ref: '123-abc'
      }
    };
    expect(parse(msg)).toEqual({
      sender: '123-abc',
      text: '',
      originalRequest: msg,
      ref: 'SomeData',
      type: 'facebook'
    });
  });
});
