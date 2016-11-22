'use strict';

module.exports = {
  encode(str) {
    return new Buffer(str).toString('base64').replace(/\+/g, '-');
  },
  decode(str) {
    return new Buffer(str.replace(/\-/g, '+'), 'base64').toString('utf8');
  }
};
