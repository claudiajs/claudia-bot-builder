/*global describe, it, expect, require, jasmine, beforeEach */
'use strict';
var reply = require('../../lib/google/reply');


describe('Google Reply', () => {
  var assistant;
  beforeEach(() => {
    assistant = jasmine.createSpyObj('assistant', ['tell']);
    assistant.response_ = jasmine.createSpyObj('assistant.response_', ['_getData']);
  });

  it('Basic tests to test reply', ()=> {
    expect(reply()).toEqual(undefined);
    expect(reply(undefined, 'Claudia Google Bot')).toEqual(undefined);
    expect(reply({ hello: 'Google'}, 'Claudia Google Bot')).toEqual({ hello: 'Google'});
  });

  it('just calls tell when its an object', () => {
    reply('Hello', '', assistant);
    expect(assistant.tell).toHaveBeenCalled();
  });

});