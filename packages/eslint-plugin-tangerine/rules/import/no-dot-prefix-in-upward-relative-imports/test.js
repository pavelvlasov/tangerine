const ruleTester = require('../../../utils/rule-tester');
const rule = require('./index');

ruleTester.run('import/no-dot-prefix-in-upward-relative-imports', rule, {
  valid: [
    "import something from 'foo'",
    "import something from './foo'",
    "import something from '../foo'",
    "import something from '../../foo'",
  ],
  invalid: [
    {
      code: "import something from './../foo'",
      output: "import something from '../foo'",
      errors: [
        {
          messageId: 'unnecessaryImportPrefix',
          data: {
            source: './../foo',
          },
        },
      ],
    },
    {
      code: "import something from './../../foo'",
      output: "import something from '../../foo'",
      errors: [
        {
          messageId: 'unnecessaryImportPrefix',
          data: {
            source: './../../foo',
          },
        },
      ],
    },
  ],
});
