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
    expect(underTest.apiConfig().version).toEqual(4);
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
  [
    {
      name: 'facebook',
      path: 'facebook',
      methods: ['GET', 'POST']
    },
    {
      name: 'slackSlashCommand',
      path: 'slack/slash-command',
      methods: ['GET', 'POST']
    },
    {
      name: 'telegram',
      path: 'telegram',
      methods: ['POST']
    },
    {
      name: 'skype',
      path: 'skype',
      methods: ['POST']
    },
    {
      name: 'twilio',
      path: 'twilio',
      methods: ['POST']
    },
    {
      name: 'kik',
      path: 'kik',
      methods: ['POST']
    },
    {
      name: 'groupme',
      path: 'groupme',
      methods: ['POST']
    },
    {
      name: 'viber',
      path: 'viber',
      methods: ['POST']
    }
  ].forEach(platform => {
    describe('setting up ' + platform.name, () => {
      it('should setup the platform if the options are not provided', () => {
        underTest = botBuilder(messageHandler);
        expect(Object.keys(underTest.apiConfig().routes[platform.path])).toBeTruthy();
      });
      it('should setup the platform if the options are provided without platforms' + platform.name, () => {
        underTest = botBuilder(messageHandler, { plugins: [] });
        expect(Object.keys(underTest.apiConfig().routes[platform.path])).toBeTruthy();
      });
      it('should setup the platform if the options are provided and platform is enabled' + platform.name, () => {
        var api = botBuilder(messageHandler, { platforms: [platform.name] });
        expect(Object.keys(api.apiConfig().routes[platform.path])).toEqual(platform.methods);
      });
      it('should not setup the platform if the options are provided and platform is disabled' + platform.name, () => {
        var options = { platforms: [] };
        underTest = botBuilder(messageHandler, options);
        expect(underTest.apiConfig().routes[platform.path]).toBeFalsy();
      });
    });
  });
});
