/*global describe, it, expect, require */
'use strict';
var parse = require('../../lib/telegram/parse');

describe('Telegram parse', () => {
  it('returns nothing if the format is invalid', () => {
    expect(parse('string')).toBeUndefined();
    expect(parse()).toBeUndefined();
    expect(parse(false)).toBeUndefined();
    expect(parse(123)).toBeUndefined();
    expect(parse({})).toBeUndefined();
    expect(parse([1, 2, 3])).toBeUndefined();
  });
  it('returns false the chat id are missing', () => {
    expect(parse({message: {chat: 'some123ChatId', text: 'ello Telegram'}})).toBeUndefined();
    expect(parse({message: {text: 'pete'}})).toBeUndefined();
  });
  it('returns a parsed object when chat id is present', () => {
    var msg = {message: {chat: {id: 'some123ChatId'}, text: 'ello Telegram' }};
    expect(parse(msg)).toEqual({ sender: 'some123ChatId', text: 'ello Telegram', originalRequest: msg, type: 'telegram'});
  });
});
