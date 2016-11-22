/*global describe, it, expect, require */
'use strict';

var parse = require('../../lib/alexa/parse');

describe('Alexa parse', () => {
  it('returns nothing if the format is invalid', () => {
    expect(parse('string')).toBeUndefined();
    expect(parse()).toBeUndefined();
    expect(parse(false)).toBeUndefined();
    expect(parse(123)).toBeUndefined();
    expect(parse({})).toBeUndefined();
    expect(parse([1, 2, 3])).toBeUndefined();
  });
  it('returns undefined if the intent is missing', () => {
    expect(parse({request: {}, session: { user: 'claudia test user'} })).toBeUndefined();
  });
  it('returns undefined if the session user is missing', () => {
    expect(parse({request: { intent: { name: 'intent 1'}}, session: {} })).toBeUndefined();
  });
  it('returns undefined if the intent name is missing', () => {
    expect(parse({request: { intent: {}}, session: { user: 'claudia test user'} })).toBeUndefined();
  });
  it('returns a parsed object with proper sender and text when the intent name and session user are present', () => {
    var msg = {
      request: { intent: { name: 'intent 1'}},
      session: { user: { userId: 'claudia alexa user'}} };
    expect(parse(msg)).toEqual({ sender: 'claudia alexa user', text: '', originalRequest: msg, type: 'alexa-skill'});
  });
});
