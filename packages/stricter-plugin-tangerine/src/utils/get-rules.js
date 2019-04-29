const { readdirSync, statSync } = require('fs');
const { basename, resolve } = require('path');

const getRules = rulesRoot => {
  /*
    Assume every rule has its own directory:
    - index.js - rule code
    - README.md - documentation

    Rule name = relative path from rulesRoot to rule directory
    */
  const rules = readdirSync(rulesRoot)
    .map(file => resolve(rulesRoot, file))
    .filter(filePath => statSync(filePath).isFile() && filePath.endsWith('.rule.js'));

  const result = rules.reduce((acc, rule) => {
    const ruleName = basename(rule, '.rule.js');
    // eslint-disable-next-line global-require, import/no-dynamic-require
    acc[ruleName] = require(rule);
    return acc;
  }, {});

  return result;
};

module.exports = getRules;
