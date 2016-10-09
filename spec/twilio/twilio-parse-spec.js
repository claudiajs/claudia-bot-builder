/*global describe, it, expect, require */
'use strict';
var parse = require('../../lib/twilio/parse');
const qs = require('querystring');

describe('Twilio parse', () => {
  it('returns nothing if the format is invalid', () => {
    expect(parse(qs.stringify('string'))).toBeUndefined();
    expect(parse()).toBeUndefined();
    expect(parse(qs.stringify(false))).toBeUndefined();
    expect(parse(qs.stringify(123))).toBeUndefined();
    expect(parse(qs.stringify({}))).toBeUndefined();
    expect(parse(qs.stringify([1, 2, 3]))).toBeUndefined();
  });
  it('returns nothing if the Body is undefined or missing', () => {
    expect(parse(qs.stringify({From: '+3333333333'}))).toBeUndefined();
    expect(parse(qs.stringify({From: '+3333333333', Body: undefined}))).toBeUndefined();
  });
  it('returns nothing if the From is undefined or missing', () => {
    expect(parse(qs.stringify({Body: 'SMS Twilio'}))).toBeUndefined();
    expect(parse(qs.stringify({From: undefined, Body: 'SMS Twilio'}))).toBeUndefined();
  });
  it('returns a parsed object when Body and From are present', () => {
    var msg = qs.stringify({From: '+3333333333', Body: 'SMS Twilio'});
    expect(parse(msg)).toEqual({ sender: '+3333333333', text: 'SMS Twilio', originalRequest: qs.parse(msg), type: 'twilio'});
  });
});
