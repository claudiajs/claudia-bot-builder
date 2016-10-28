/*global describe, it, expect, require */
'use strict';
var parse = require('../../lib/kik/parse');

describe('Kik parse', () => {
  it('returns nothing if the format is invalid', () => {
    expect(parse('string')).toBeUndefined();
    expect(parse()).toBeUndefined();
    expect(parse(false)).toBeUndefined();
    expect(parse(123)).toBeUndefined();
    expect(parse({})).toBeUndefined();
    expect(parse([1, 2, 3])).toBeUndefined();
  });
  it('returns false if the message chatId is missing', () => {
    expect(parse({from: 'someUser', body: '2342342fwefwsdf', type: 'text'})).toBeUndefined();
    expect(parse({body: undefined})).toBeUndefined();
  });
  it('returns a parsed object with proper chatId and kikType when the chatId is present and kikType is text', () => {
    var msg = {from: 'firstUser', chatId: 123412312, body: 'Hello Kik', type: 'text'};
    var contextId = '3sdfsdfsdf24';
    expect(parse(msg, contextId)).toEqual({ sender: 'firstUser', text: 'Hello Kik', chatId: 123412312, kikType: 'text', originalRequest: msg, type: 'kik'});
  });
});
