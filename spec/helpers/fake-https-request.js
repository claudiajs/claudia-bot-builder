/*global beforeEach, jasmine, afterEach */
var https = require('https'),
  oldHttpsRequest;
beforeEach(() => {
  var listeners = {};
  https.request = jasmine.createSpy('httpsRequest').and.callFake(() => {
    var fake = {
      on: function (eventName, listener) {
        listeners[eventName] = listener;
        return fake;
      },
      end: function () {
        return fake;
      }
    };
    return fake;
  });
  https.request.listeners = listeners;
  https.request.respond = function (body, statusCode, statusMessage) {
    var responseListeners = {},
      fakeResponse = {
        setEncoding: function () {},
        on: function (eventName, listener) {
          responseListeners[eventName] = listener;
        },
        statusCode: statusCode,
        statusMessage: statusMessage
      };
    listeners['response'](fakeResponse);
    responseListeners['data'](body);
    responseListeners['end'];
  };
  https.request.networkError = function (err) {
    listeners['error'](err);
  };
});
afterEach(() => {
  https.request = oldHttpsRequest;
});
