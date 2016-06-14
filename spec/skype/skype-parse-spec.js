/*global describe, it, expect, require */
'use strict';
var parse = require('../../lib/skype/parse');

describe('Skype parse', () => {
  it('returns nothing if the format is invalid', () => {
    var contextId = '3sdfsdfsdf24';
    expect(parse('string', contextId)).toBeUndefined();
    expect(parse()).toBeUndefined();
    expect(parse(false, contextId)).toBeUndefined();
    expect(parse(123, contextId)).toBeUndefined();
    expect(parse({}, contextId)).toBeUndefined();
    expect(parse([1, 2, 3], contextId)).toBeUndefined();
  });
  it('returns false if the message content is missing', () => {
    expect(parse({from: {id: 111}, contextId: '2342342fwefwsdf'})).toBeUndefined();
    expect(parse({content: undefined})).toBeUndefined();
  });
  it('returns a parsed object with proper contextId when the content is present and contextId is present', () => {
    var msg = {content:'Bonjour Skype', from: {id: 123412312}, id: 324234234};
    var contextId = '3sdfsdfsdf24';
    expect(parse(msg, contextId)).toEqual({ sender: {id: 123412312}, text: 'Bonjour Skype', originalRequest: 324234234, contextId: '3sdfsdfsdf24', type: 'skype'});
  });
  it('returns a parsed object with undefined contextId when the content is present and contextId is not', () => {
    var msg = {content:'Bonjour Skype', from: {id: 123412312}, id: 324234234};
    expect(parse(msg)).toEqual({ sender: {id: 123412312}, text: 'Bonjour Skype', originalRequest: 324234234, contextId: undefined, type: 'skype'});
  });
});
