/*global describe, it, expect, require */
var parse = require('../lib/facebook/parse');
describe('Facebook parse', () => {
  it('returns nothing if the format is invalid', () => {
    expect(parse('string')).toBeUndefined();
    expect(parse()).toBeUndefined();
    expect(parse(false)).toBeUndefined();
    expect(parse(123)).toBeUndefined();
    expect(parse({})).toBeUndefined();
    expect(parse([1, 2, 3])).toBeUndefined();
  });
  it('returns false if the message or sender are missing', () => {
    expect(parse({sender: 'tom'})).toBeUndefined();
    expect(parse({message: 'pete'})).toBeUndefined();
  });
  it('returns a parsed object when there message and sender are present', () => {
    var msg = {sender: {id: 'tom'}, message: { text: 'Hello' }};
    expect(parse(msg)).toEqual({ sender: 'tom', text: 'Hello', originalRequest: msg, type: 'facebook'});
  });
});
