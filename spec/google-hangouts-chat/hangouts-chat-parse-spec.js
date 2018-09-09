/*global describe, it, expect, require */
'use strict';

const parse = require('../../lib/google-hangouts-chat/parse');

describe('Google Hangout Chat parse', () => {
  it('should return nothing if the format is invalid', () => {
    expect(parse('string')).toBeUndefined();
    expect(parse()).toBeUndefined();
    expect(parse(false)).toBeUndefined();
    expect(parse(123)).toBeUndefined();
    expect(parse({})).toBeUndefined();
    expect(parse([1, 2, 3])).toBeUndefined();
  });
  it('should return undefined if the session user is missing', () => {
    expect(parse({message: {}})).toBeUndefined();
  });
  it('should return original request with an empty text if the intent is missing', () => {
    let msg = {message: {foo: 'bar'}, type:  'ADDED_TO_SPACE'};
    expect(parse(msg)).toEqual({ sender: 'no sender', text: '', originalRequest: msg, type: 'google-hangouts-chat-add-command'});
  });
  it('should return original request with an empty text if the intent name is missing', () => {
    let msg = {message: {foo: 'bar'}, type:  'REMOVED_FROM_SPACE'};
    expect(parse(msg)).toEqual({ sender: 'no sender', text: '', originalRequest: msg, type: 'google-hangouts-chat-remove-command'});
  });
  it('should return a parsed object with proper sender and text when the intent name and session user are present', () => {
    const msg = {
      'type': 'MESSAGE',
      'eventTime': '2017-03-02T19:02:59.910959Z',
      'space': {
        'name': 'spaces/AAAAAAAAAAA',
        'displayName': 'Ramdom Discussion Room',
        'type': 'ROOM'
      },
      'message': {
        'name': 'spaces/AAAAAAAAAAA/messages/CCCCCCCCCCC',
        'sender': {
          'name': 'users/12345678901234567890',
          'displayName': 'John Doe',
          'avatarUrl': 'https://lh3.googleusercontent.com/.../photo.jpg',
          'email': 'john@example.com'
        },
        'createTime': '2017-03-02T19:02:59.910959Z',
        'text': 'Hello World',
        'thread': {
          'name': 'spaces/AAAAAAAAAAA/threads/BBBBBBBBBBB'
        }
      }
    };

    expect(parse(msg)).toEqual({
      sender: 'users/12345678901234567890',
      text: 'Hello World',
      originalRequest: msg,
      type: 'google-hangouts-chat-message'
    });
  });
});
