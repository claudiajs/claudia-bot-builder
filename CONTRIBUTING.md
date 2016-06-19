# Developing and contributing to claudia-bot-builder

## Folder structure

The main body of code is in the [lib](lib) directory. Each separate bot type should be in its own sub-directory, and the main [bot-builder.js](lib/bot-builder.js) class should only be used to set up wiring for the bots.

The tests are in the [spec](spec) directory, and should follow the structure of the corresponding source files. All executable test file names should end with `-spec`, so they will be automatically picked up by `npm test`. Any additional project files, helper classes etc that must not be directly executed by the test runner should not end with `-spec`. You can use the [spec/helpers](spec/helpers) directory to store Jasmine helpers, that will be loaded before any test is executed.

## Running tests

We use [Jasmine](https://jasmine.github.io/) for unit and integration tests. Unless there is a very compelling reason to use something different, please continue using Jasmine for tests. The existing tests are in the [spec](spec) folder. Here are some useful command shortcuts:

Run all the tests:

```bash
npm test
```

Run only some tests:

```bash
npm test -- filter=prefix
```

Get detailed hierarchical test name reporting:

```bash
npm test -- full
```

## Before submitting a pull request

AWS Lambda currently supports Node.js 4.3.2. Please run your tests using that version before submitting a pull request to ensure compatibility.

We use [ESLint](http://eslint.org/) for syntax consistency, and the linting rules are included in this repository. Running `npm test` will check the linting rules as well. Please make sure your code has no linting errors before submitting a pull request.


