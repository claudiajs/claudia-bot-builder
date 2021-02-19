
/*global describe, it, expect, require, beforeEach */
'use strict';
const getAssistant = require('../../lib/google/assistant');
var parse = require('../../lib/google/parse');

describe('Google Reply', () => {
  beforeEach(() => {
  });

  it('Sets the AccessToken if AuthorizationToken is present in session', () => {
    const assistant = getAssistant(request);
    var parsed = parse(assistant, request);
    expect(parsed.accessToken).toEqual('USER_ACCESSTOKEN');
  });

  it('Sets the user_id if it is present', () => {
    const assistant = getAssistant(request);
    var parsed = parse(assistant, request);
    expect(parsed.sender).toEqual('USER_ID');
  });
});


const request = {
  body: {
    'user': {
      'userId': 'USER_ID',
      'accessToken': 'USER_ACCESSTOKEN',
      'locale': 'en-US',
      'lastSeen': '2018-04-25T14:27:02Z'
    },
    'isInSandbox': true
  }};