/*global module*/
var chunk = function (tx, callback) {
  var prev = 0,
    re = /\s/gi,
    chunk;
  while (re.exec(tx)) {
    chunk = tx.slice(prev, re.lastIndex - 1);
    callback(chunk);
    prev = re.lastIndex - 1;
  }
  if (prev < tx.length) {
    callback(tx.slice(prev));
  }
};

module.exports = function (text, limit) {
  'use strict';
  var lines = [],
    currentLine = [],
    currentLineLength = 0,
    closeLine = function () {
      if (currentLineLength) {
        lines.push(currentLine.join('').trim());
        currentLine = [];
        currentLineLength = 0;
      }
    },
    processChunk = function (chunk) {
      var index;
      if (currentLineLength + chunk.length > limit) {
        closeLine();
      }
      if (chunk.length > limit) {
        for (index = 0; index < chunk.length; index += limit) {
          processChunk(chunk.slice(index, index + limit));
        }
      } else {
        currentLineLength += chunk.length;
        currentLine.push(chunk);
      }
    };

  if (text === '') {
    return [''];
  }

  chunk(text, processChunk);
  closeLine();

  return lines;
};
