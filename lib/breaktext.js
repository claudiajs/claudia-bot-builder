/*global module*/
module.exports = function (text, limit) {
  'use strict';
  var lines = [];
  while (text.length > limit) {
    let chunk = text.substring(0, limit),
      lastWhiteSpace = chunk.lastIndexOf(' ');
    if (lastWhiteSpace !== -1) limit = lastWhiteSpace;
    lines.push(chunk.substring(0, limit));
    text = text.substring(limit + 1);
  }
  lines.push(text);

  return lines;
};
