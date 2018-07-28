/*global describe, it, expect */
'use strict';
var reply = require('../../lib/slack/reply');

describe('Slack Reply', () => {

  it('returns a formatted output if string is passed', () =>
    expect(reply('string')).toEqual({
      text: 'string'
    })
  );
  
  it('returns an empty string if argument type is dialog_submission', () =>
    expect(reply('string', 'dialog_submission')).toEqual('')
  );
  
  it('returns an empty string if type is dialog_cancellation', () =>
    expect(reply('string', 'dialog_cancellation')).toEqual('')
  );

  it('returns a formatted output if string is passed and secound argument is not dialog_submission or dialog_cancellation', () =>
    expect(reply('string', 'ads')).toEqual({
      text: 'string'
    })
  );

  it('returns the same thing that was passed if argument is not a string', () => {
    expect(reply()).toBeUndefined();
    expect(reply(123, 'asd')).toBe(123);
    expect(reply([], 'asd')).toEqual([]);
    expect(reply({}, 'asd')).toEqual({});
    expect(reply({ key: 'value' }, 'asd')).toEqual({ key: 'value' });
  });
});
