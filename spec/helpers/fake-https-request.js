/*global beforeEach, afterEach */
var fake = require('fake-http-request');
beforeEach(() => {
  fake.install('https');
});
afterEach(() => {
  fake.uninstall('https');
});
