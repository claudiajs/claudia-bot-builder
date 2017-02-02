/*global describe, it, expect, require */
'use strict';
const parse = require('../../lib/line/parse');

describe('LINE parse', () => {
  it('returns nothing if the format is invalid', () => {
    expect(parse('string')).toBeUndefined();
    expect(parse()).toBeUndefined();
    expect(parse(false)).toBeUndefined();
    expect(parse(123)).toBeUndefined();
    expect(parse({})).toBeUndefined();
    expect(parse([1, 2, 3])).toBeUndefined();
  });
  it('returns nothing if the message type or source with userId is missing', () => {
    expect(parse({replyToken: 'someRandomToken', source: { userId: 'ola Line'}, message: {text: 'hello'}})).toBeUndefined();
    expect(parse({type: 'message', replyToken: 'someRandomToken', source: {}, message: {text: 'hello'}})).toBeUndefined();
  });
  it('returns a parsed object with replyToken and type line when the replyToken is present and source and source user.id is text', () => {
    let msg = {type: 'message', replyToken: 'someRandomToken', source: { userId: 'ola Line'}, message: {text: 'hello'}};
    expect(parse(msg)).toEqual({ sender: 'ola Line', replyToken: 'someRandomToken', text: 'hello', originalRequest: msg, type: 'line'});
  });
});