
/*global describe, it, expect, require, beforeEach */
'use strict';
var parse = require('../../lib/cortana/parse');

describe('Cortana Reply', () => {
  beforeEach(() => {
  });

  it('Sets the AccessToken if AuthorizationToken is present in session', () => {
    var session = { message: { user: { id: '1' }, entities: [{ type: 'AuthorizationToken', token: '1234' }, {}] } };
    var parsed = parse(session);
    expect(parsed.accessToken).toEqual('1234');
  });

  it('Sets AccessToken to undefined if AuthorizationToken is not present in session', () => {
    var session = { message: { user: { id: '1' }, entities: [{}] } };
    var parsed = parse(session);
    expect(parsed.accessToken).toEqual(undefined);
  });
});
