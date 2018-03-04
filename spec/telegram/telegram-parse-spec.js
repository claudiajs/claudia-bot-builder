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
  it('returns a parsed object when messageObject contains a callback_query', () => {
    var msg = {callback_query: {message: {chat: {id: 'some123ChatId'}},data: 'someCallbackData'}};
    expect(parse(msg)).toEqual({ sender: 'some123ChatId', text: 'someCallbackData', originalRequest: msg, type: 'telegram'});
  });
  it('returns a parsed object when messageObject contains a channel post', () => {
    var msg = {channel_post: {chat: {id: 'some123ChatId'}, text: 'ello Telegram channel' }};
    expect(parse(msg)).toEqual({ sender: 'some123ChatId', text: 'ello Telegram channel', originalRequest: msg, type: 'telegram'});
  });
  it('sender field should be equal to actual user_id', () => {
    var msg = {
      update_id: 920742096,
      inline_query: {
        id: '512944664604439953',
        from: {
          id: 119429236,
          first_name: 'Sergey',
          last_name: 'Tverskikh',
          username: 'tverskih'
        },
        query: 'share',
        offset: ''
      }
    };
    expect(parse(msg)).toEqual({
      sender: 119429236,
      text: 'share',
      originalRequest: msg,
      type: 'telegram'
    });
  });
});
