const { join } = require('path');
const getRules = require('./utils/get-rules');

const allRules = getRules(join(__dirname, 'rules'));

module.exports = {
  rules: allRules,
};
