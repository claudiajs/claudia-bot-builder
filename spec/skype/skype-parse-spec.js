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
    expect(parse({text: undefined})).toBeUndefined();
  });
  it('returns a parsed object with proper contextId when the text is present and contextId is present', () => {
    var msg = {text:'Bonjour Skype', conversation: {id: 123412312}, id: 324234234};
    var contextId = '3sdfsdfsdf24';
    expect(parse(msg, contextId)).toEqual({ sender: 123412312, text: 'Bonjour Skype', originalRequest: msg, contextId: '3sdfsdfsdf24', type: 'skype'});
  });
  it('returns a parsed object with undefined contextId when the content is present and contextId is not', () => {
    var msg = {text:'Bonjour Skype', conversation: {id: 123412312}, id: 324234234};
    expect(parse(msg)).toEqual({ sender: 123412312, text: 'Bonjour Skype', originalRequest: msg, contextId: undefined, type: 'skype'});
  });
});
