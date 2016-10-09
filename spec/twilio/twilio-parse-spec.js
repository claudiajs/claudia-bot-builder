/*global describe, it, expect, require */
'use strict';
var parse = require('../../lib/telegram/parse');

describe('Twilio parse', () => {
  it('returns nothing if the format is invalid', () => {
    expect(parse('string')).toBeUndefined();
    expect(parse()).toBeUndefined();
    expect(parse(false)).toBeUndefined();
    expect(parse(123)).toBeUndefined();
    expect(parse({})).toBeUndefined();
    expect(parse([1, 2, 3])).toBeUndefined();
  });
  it('returns nothing if the Body is undefined or missing', () => {
    expect(parse({From: '+3333333333'})).toBeUndefined();
    expect(parse({From: '+3333333333', Body: undefined})).toBeUndefined();
  });
  it('returns nothing if the From is undefined or missing', () => {
    expect(parse({Body: 'SMS Twilio'})).toBeUndefined();
    expect(parse({From: undefined, Body: 'SMS Twilio'})).toBeUndefined();
  });
  it('returns a parsed object when Body and From are present', () => {
    var msg = {From: '+3333333333', Body: 'SMS Twilio'};
    expect(parse(msg)).toEqual({ sender: '+3333333333', text: 'SMS Twilio', originalRequest: msg, type: 'twilio'});
  });
});
