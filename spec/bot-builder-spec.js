/*global describe, it, jasmine, expect, beforeEach*/
var botBuilder = require('../lib/bot-builder');
describe('BotBuilder', () => {
  var messageHandler, underTest, lambdaContextSpy;
  
  beforeEach(() => {
    messageHandler = jasmine.createSpy('messageHandler');
    lambdaContextSpy = jasmine.createSpyObj('lambdaContext', ['done']);
    underTest = botBuilder(messageHandler);
  });
  
  it('configures a Claudia Rest API', () => {
    expect(underTest.apiConfig().version).toEqual(2);
  });

  it('sets up a GET route for /', () => {
    underTest.router({
      context: {
        path: '/',
        method: 'GET'
      }
    }, lambdaContextSpy);
    expect(lambdaContextSpy.done).toHaveBeenCalledWith(null, 'Ok');
  });
});
