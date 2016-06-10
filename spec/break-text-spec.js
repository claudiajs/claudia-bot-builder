/*global describe, it, expect, require */
var breakText = require('../lib/breaktext');
describe('breakText', () => {
  it('returns a single line if less than length', () => {
    expect(breakText('abc def', 10)).toEqual(['abc def']);
    expect(breakText('abc def', 7)).toEqual(['abc def']);
  });
  it('breaks around max length', () => {
    expect(breakText('abc def', 5)).toEqual(['abc', 'def']);
  });
  it('breaks words that are too long', () => {
    expect(breakText('abcdef 123456789', 5)).toEqual(['abcde', 'f', '1234', '56789']);
  });
  it('does not explode on blank strings', () => {
    expect(breakText('', 5)).toEqual(['']);
  });
});
