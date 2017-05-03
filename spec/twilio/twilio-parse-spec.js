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
  it('returns nothing if the Body is undefined or missing and there are 0 media attachments', () => {
    expect(parse(qs.stringify({From: '+3333333333', NumMedia: '0'}))).toBeUndefined();
    expect(parse(qs.stringify({From: '+3333333333', Body: undefined, NumMedia: '0'}))).toBeUndefined();
  });
  it('returns nothing if the From is undefined or missing', () => {
    expect(parse(qs.stringify({Body: 'SMS Twilio'}))).toBeUndefined();
    expect(parse(qs.stringify({From: undefined, Body: 'SMS Twilio'}))).toBeUndefined();
  });
  it('returns a parsed object when Body and From are present', () => {
    var msg = qs.stringify({From: '+3333333333', Body: 'SMS Twilio'});
    expect(parse(msg)).toEqual({ sender: '+3333333333', text: 'SMS Twilio', originalRequest: qs.parse(msg), type: 'twilio'});
  });
  it('returns a parsed object when From is present and MMS attachments exist', () => {
    var msg = qs.stringify({From: '+3333333333', NumMedia: '1', MediaContentType0: 'image/jpeg', MediaUrl0: 'https://api.twilio.com/test'});
    expect(parse(msg)).toEqual({
      sender: '+3333333333',
      text: undefined,
      originalRequest: qs.parse(msg),
      type: 'twilio',
      media: [{ contentType: 'image/jpeg', url: 'https://api.twilio.com/test' }]
    });
  });
  it('returns a parsed object where From is present and multiple MMS attachments exist', () => {
    var msg = qs.stringify({
      From: '+3333333333',
      NumMedia: '2',
      MediaContentType0: 'image/jpeg',
      MediaContentType1: 'video/mp4',
      MediaUrl0: 'https://api.twilio.com/test0',
      MediaUrl1: 'https://api.twilio.com/test1'
    });
    expect(parse(msg)).toEqual({
      sender: '+3333333333',
      text: undefined,
      originalRequest: qs.parse(msg),
      type: 'twilio',
      media: [
        {
          contentType: 'image/jpeg',
          url: 'https://api.twilio.com/test0'
        },
        {
          contentType: 'video/mp4',
          url: 'https://api.twilio.com/test1'
        }
      ]
    });
  });
});
