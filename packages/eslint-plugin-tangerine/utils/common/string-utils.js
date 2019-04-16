const camelCase = require('lodash/camelCase');

const pascalCase = string => {
  if (string === '') {
    return string;
  }
  const camelCaseString = camelCase(string);
  return camelCaseString.charAt(0).toUpperCase() + camelCaseString.slice(1);
};

module.exports = { pascalCase };
