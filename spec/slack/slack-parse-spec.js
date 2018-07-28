/*global describe, it, expect, require */
var parse = require('../../lib/slack/parse');

describe('Slack parse', () => {
  it('returns nothing if the format is invalid', () => {
    expect(parse('string')).toBeUndefined();
    expect(parse()).toBeUndefined();
    expect(parse(false)).toBeUndefined();
    expect(parse(123)).toBeUndefined();
    expect(parse({})).toBeUndefined();
    expect(parse([1, 2, 3])).toBeUndefined();
  });

  it('returns nothing if user_id and actions are missing', () => {
    expect(parse({text: 'pete'})).toBeUndefined();
  });

  it('returns an empty text if the text is missing', () => {
    var msg = { user_id: 123 };
    expect(parse(msg)).toEqual({ sender: 123, text: '', originalRequest: msg, type: 'slack-slash-command'});
  });

  it('returns a parsed object when text and user_id are present', () => {
    var msg = { user_id: 123, text: 'Hello' };
    expect(parse(msg)).toEqual({ sender: 123, text: 'Hello', originalRequest: msg, type: 'slack-slash-command'});
  });

  it('returns a parsed object when actions are present', () => {
    var msg = { user: { id: 123, name: 'username' }, actions: [{name: 'test', value: 'action'}] };
    expect(parse(msg)).toEqual({ sender: 123, text: '', originalRequest: msg, type: 'slack-message-action', postback: true});
  });
  
  it('returns a parsed object when user and type dialog_submission are present', () => {
    var msg = { user: { id: 123, name: 'username' }, type: 'dialog_submission' };
    expect(parse(msg)).toEqual({ sender: 123, text: '', originalRequest: msg, type: 'slack-dialog-confirm', postback: true});
  });
  
  it('returns a parsed object when user and type dialog_cancellation are present', () => {
    var msg = { user: { id: 123, name: 'username' }, type: 'dialog_cancellation' };
    expect(parse(msg)).toEqual({ sender: 123, text: '', originalRequest: msg, type: 'slack-dialog-cancel', postback: true});
  });
});
