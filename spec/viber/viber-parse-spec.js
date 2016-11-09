/* global describe, it, expect, require */
'use strict';
var parse = require('../../lib/viber/parse');

describe('Viber parse', () => {
  it('should not return anything if the format is invalid', () => {
    expect(parse('Just a string')).toBeUndefined();
    expect(parse()).toBeUndefined();
    expect(parse(false)).toBeUndefined();
    expect(parse(123)).toBeUndefined();
    expect(parse({})).toBeUndefined();
    expect(parse([1, 2, 3])).toBeUndefined();
  });
  it('should not return anything if message is missing', () => {
    expect(parse({sender: { id: 1 }})).toBeUndefined();
  });
  it('should return a parsed object if message is in correct format', () => {
    var msg = {
      event: 'message',
      timestamp: new Date().getTime(),
      message_token: 123,
      sender: {
        id: 'ABC',
        name: 'Claudia',
        avatar: 'https://claudiajs.com/assets/claudiajs.png'
      },
      message: {
        text: 'Hello',
        type: 'text'
      }
    };
    expect(parse(msg)).toEqual({
      sender: msg.sender.id,
      text: msg.message.text,
      originalRequest: msg,
      type: 'viber'
    });
  });
  it('should return a parsed object with an empty text if message is not textual', () => {
    var msg = {
      event: 'message',
      timestamp: new Date().getTime(),
      message_token: 123,
      sender: {
        id: 'ABC',
        name: 'Claudia',
        avatar: 'https://claudiajs.com/assets/claudiajs.png'
      },
      message: {
        type: 'image'
      }
    };
    expect(parse(msg)).toEqual({
      sender: msg.sender.id,
      text: '',
      originalRequest: msg,
      type: 'viber'
    });
  });
});
