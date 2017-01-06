/*global describe, it, expect, require */
const isUrl = require('../lib/is-url');
describe('isUrl', () => {
  it('should be a function', () => {
    expect(typeof isUrl).toBe('function');
  });
  it('should return false for an invalid url', () => {
    expect(isUrl('')).toBeFalsy();
    expect(isUrl('test')).toBeFalsy();
    expect(isUrl('http://')).toBeFalsy();
    expect(isUrl('http//google')).toBeFalsy();
  });
  it('should return true for a valid url', () => {
    expect(isUrl('http://claudiajs.com')).toBeTruthy();
    expect(isUrl('https://claudiajs.com')).toBeTruthy();
    expect(isUrl('https://www.claudiajs.com')).toBeTruthy();
    expect(isUrl('https://github.com/claudiajs')).toBeTruthy();
    expect(isUrl('https://github.com/claudiajs/claudia-bot-builder')).toBeTruthy();
    expect(isUrl('https://www.google.com/#q=claudia,bot')).toBeTruthy();
  });
  it('should return false if url is in the sentence', () => {
    expect(isUrl('This is a valid url: http://google.com')).toBeFalsy();
    expect(isUrl('http://google.com is an url')).toBeFalsy();
  });
});
