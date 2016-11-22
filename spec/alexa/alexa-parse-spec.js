/*global describe, it, expect, require */
'use strict';

var parse = require('../../lib/alexa/parse');

describe('Alexa parse', () => {
  it('should return nothing if the format is invalid', () => {
    expect(parse('string')).toBeUndefined();
    expect(parse()).toBeUndefined();
    expect(parse(false)).toBeUndefined();
    expect(parse(123)).toBeUndefined();
    expect(parse({})).toBeUndefined();
    expect(parse([1, 2, 3])).toBeUndefined();
  });
  it('should return undefined if the session user is missing', () => {
    expect(parse({request: { intent: { name: 'intent 1'}}, session: {} })).toBeUndefined();
  });
  it('should return original request with an empty text if the intent is missing', () => {
    let msg = {request: {}, session: { user: { userId: 'claudia alexa user'} } };
    expect(parse(msg)).toEqual({ sender: 'claudia alexa user', text: '', originalRequest: msg, type: 'alexa-skill'});
  });
  it('should return original request with an empty text if the intent name is missing', () => {
    let msg = {request: { intent: {}}, session: { user: { userId: 'claudia alexa user'} } };
    expect(parse(msg)).toEqual({ sender: 'claudia alexa user', text: '', originalRequest: msg, type: 'alexa-skill'});
  });
  it('should return a parsed object with proper sender and text when the intent name and session user are present', () => {
    let msg = {
      request: { intent: { name: 'intent 1'}},
      session: { user: { userId: 'claudia alexa user'}} };
    expect(parse(msg)).toEqual({ sender: 'claudia alexa user', text: '', originalRequest: msg, type: 'alexa-skill'});
  });
});
