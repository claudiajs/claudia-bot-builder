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
    expect(underTest.apiConfig().version).toEqual(3);
  });

  it('sets up a GET route for /', (done) => {
    underTest.proxyRouter({
      requestContext: {
        resourcePath: '/',
        httpMethod: 'GET'
      }
    }, lambdaContextSpy).then(() => {
      expect(lambdaContextSpy.done).toHaveBeenCalledWith(null, jasmine.objectContaining({body: '"Ok"'}));
    }).then(done, done.fail);
  });
});
