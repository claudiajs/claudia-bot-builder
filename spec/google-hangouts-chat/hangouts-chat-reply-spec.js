/*global describe, it, expect, require */
'use strict';
const reply = require('../../lib/google-hangouts-chat/reply');

describe('Google Hangouts Chat Reply', () => {

  it('just returns the bot response when its not a string', () => {
    expect(reply()).toEqual(undefined);
    expect(reply(undefined, 'Google Hangouts Chat Bot')).toEqual(undefined);
    expect(reply({ hello: 'Google Hangouts Chat Bot'}, 'Google Hangouts Chat Bot')).toEqual({ hello: 'Google Hangouts Chat Bot'});
  });

  it('just returns the proper Google Hangouts Chat response when its not a string', () => {
    expect(reply('Google Hangouts Chat Bot', 'Google Hangouts Chat Bot'))
      .toEqual({
        text: 'Google Hangouts Chat Bot'
      });
  });
});
