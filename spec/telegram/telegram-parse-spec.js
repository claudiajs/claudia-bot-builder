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
  it('returns false if the text and/or the chat id are missing', () => {
    expect(parse({chat: 'some123ChatId', text: 'ello Telegram'})).toBeUndefined();
    expect(parse({chat: {id: 'some123ChatId'}})).toBeUndefined();
    expect(parse({text: 'pete'})).toBeUndefined();
  });
  it('returns a parsed object when the text and chat id are present', () => {
    var msg = {chat: {id: 'some123ChatId'}, text: 'ello Telegram' };
    expect(parse(msg)).toEqual({ sender: 'some123ChatId', text: 'ello Telegram', originalRequest: 'some123ChatId', type: 'telegram'});
  });
});
