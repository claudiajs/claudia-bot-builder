'use strict';

const tlReply = require('./reply');
const tlParse = require('./parse');

module.exports = function tlSetup(api, bot, logError) {

  api.post('/telegram', request => {
    let tlMesssage = request.body.message;

    return bot(tlParse(tlMessage))
      .then(tlReply)
      .catch(logError);
  });
}
