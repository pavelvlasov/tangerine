const { RuleTester } = require('eslint');

/*
RuleTester.describe = (text, method) => method();
RuleTester.it = (text, method) => method();
*/

const parserOptions = {
  ecmaVersion: 8,
  ecmaFeatures: {
    jsx: true,
  },
  sourceType: 'module',
};

module.exports = new RuleTester({ parser: 'babel-eslint', parserOptions });
