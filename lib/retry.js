
module.exports = function retry(promiseGenerator, delay, maxTimes, predicate, onRetry) {
  'use strict';
  if (!maxTimes) {
    return Promise.reject('failing to retry');
  }
  return promiseGenerator().catch(function (failure) {
    if (maxTimes > 1 && (!predicate || (predicate && predicate(failure)))) {
      if (onRetry) {
        return onRetry();
      }
      return delayFn(delay).then(function () {
        return retry (promiseGenerator, delay, maxTimes - 1, predicate, onRetry);
      });
    } else {
      return Promise.reject(failure);
    }
  });
};

function delayFn(ms) {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, ms);
  });
}