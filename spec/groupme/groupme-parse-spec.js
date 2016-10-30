/*global describe, it, expect, require */
'use strict';
var parse = require('../../lib/groupme/parse');

describe('GroupMe parse', () => {
  it('returns nothing if the format is invalid', () => {
    expect(parse('string')).toBeUndefined();
    expect(parse()).toBeUndefined();
    expect(parse(false)).toBeUndefined();
    expect(parse(123)).toBeUndefined();
    expect(parse({})).toBeUndefined();
    expect(parse([1, 2, 3])).toBeUndefined();
  });
  it('returns undefined if the message text is missing', () => {
    expect(parse({sender_type: 'user', group_id: 1 })).toBeUndefined();
  });
  it('returns undefined if the message group_id is missing', () => {
    expect(parse({sender_type: 'user', text: 'hello groupme'})).toBeUndefined();
  });
  it('returns undefined if the message sender_type is a bot', () => {
    expect(parse({sender_type: 'bot', text: 'hello groupme', group_id: 1})).toBeUndefined();
  });
  it('returns a parsed object with proper sender and text when the text and group_id are present and sender_type is not a bot', () => {
    var msg = {group_id: 1, text: 'hello groupme', sender_type: 'user'};
    expect(parse(msg)).toEqual({ sender: 1, text: 'hello groupme', originalRequest: msg, type: 'groupme'});
  });
});
