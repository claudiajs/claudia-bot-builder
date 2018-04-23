/*global describe, it, expect, require, jasmine, beforeEach */
'use strict';
var reply = require('../../lib/cortana/reply');

describe('Cortana Reply', () => {
  var session;
  beforeEach(() => {
    session = jasmine.createSpyObj('session', ['send', 'endConversation']);
  });

  it('just calls send when its an object', () => {
    reply({}, session);
    expect(session.send).toHaveBeenCalled();
  });

  it('just calls endConversation when its an string', () => {
    reply('a text', session);
    expect(session.endConversation).toHaveBeenCalled();
  });

  it('calls send for each object if is an array', () => {
    reply(['a text', { text: 'object text'}], session);
    expect(session.send.calls.count()).toBe(2);
  });
});
