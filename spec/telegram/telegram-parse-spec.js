/*global describe, it, expect, require */
'use strict';
var parse = require('../../lib/telegram/parse');

describe('Telegram parse', () => {
  it('returns original messageObject if format is not a message or inline_query to avoid failing silently', () => {
    var msg = {callback_query: {id: 'some123CbId', {message: {chat: {id: 'some123ChatId'}, text: 'ello Telegram' }}}};
    expect(parse(msg)).toEqual({originalRequest: msg, type: 'telegram'});
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
