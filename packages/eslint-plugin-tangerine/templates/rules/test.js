const ruleTester = require('../../../utils/rule-tester');
const rule = require('./index');

// 1) Add rule name
ruleTester.run('<my rule name>', rule, {
  // 2) Have *several* tests for valid and invalid cases
  valid: [{ code: '' }],
  invalid: [
    {
      code: '',
      output: '', // 3) must provide correct output, if the rule is autofixable
      errors: [
        {
          messageId: '',
          data: {}, // 4) provide variables for error message (to get variable names - see text corresponding to messageId)
        },
      ],
    },
  ],
});
