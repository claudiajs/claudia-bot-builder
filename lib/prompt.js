'use strict';

const readline = require('readline');

module.exports = function prompt(questions, results) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  function singlePrompt(question) {
    return new Promise((resolve, reject) =>
      rl.question(`\x1b[36m${question}:\x1b[0m `, answer => {
        rl.close();
        if (!answer) {
          console.log(`\n\x1b[31mAnswer can't be empty!\x1b[0m\n`);
          return reject(question);
        }

        resolve({
          question: question,
          answer: answer
        });
      })
    );
  }

  if (!results)
    results = {};

  if (questions.length)
    return singlePrompt(questions.shift())
      .then(response => {
        results[response.question] = response.answer;
        return prompt(questions, results);
      })
      .catch(question => {
        if (typeof question === 'string') {
          questions.unshift(question);
          return prompt(questions, results);
        }

        return question;
      });
        
  return Promise.resolve(results);
}

