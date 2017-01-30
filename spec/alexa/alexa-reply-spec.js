/*global describe, it, expect, require */
'use strict';
var reply = require('../../lib/alexa/reply');

describe('Alexa Reply', () => {

  it('just returns the bot response when its not a string', () => {
    expect(reply()).toEqual(undefined);
    expect(reply(undefined, 'Claudia Alexa Bot')).toEqual(undefined);
    expect(reply({ hello: 'alexa'}, 'Claudia Alexa Bot')).toEqual({ hello: 'alexa'});
  });

  it('just returns the proper Alexa response when its not a string', () => {
    expect(reply('hello', 'Claudia Alexa Bot'))
      .toEqual({
        response: {
          outputSpeech: {
            type: 'PlainText',
            text: 'hello'
          },
          card: {
            type: 'Simple',
            title: 'Claudia Alexa Bot',
            content: 'hello'
          },
          shouldEndSession: true
        }
      });
  });
});
