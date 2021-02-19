// adapted from https://raw.githubusercontent.com/yoshuawuyts/promise-each/4d4397e52bea67cd94b0e13010e95ca68fd625f0/index.js

module.exports = each;

// apply a function to all values
// should only be used for side effects
// (fn) -> prom
function each (fn) {
  return (arr) => {
    arr = Array.isArray(arr) ? arr : [arr];

    return arr.reduce((prev, curr, i) => {
      return prev.then(() => fn(curr, i, arr.length));
    }, Promise.resolve()).then(() => arr);
  };
}
