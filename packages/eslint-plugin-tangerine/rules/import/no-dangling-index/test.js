const ruleTester = require('../../../utils/rule-tester');
const rule = require('./index');

ruleTester.run('import/dangling-index', rule, {
  valid: [
    "import something from 'some/path/with/no/index/at/the/end'",
    "import something from './index'",
    "import something from '.././.././../index'",
    "import something from '../index/something'",
    "import something from './index/something'",
    "import something from '/index/something'",
  ],
  invalid: [
    {
      code: "import something from '/some/absolute/path/with/index'",
      errors: [
        {
          messageId: 'removeIndex',
          data: { value: '/some/absolute/path/with/index' },
        },
      ],
      output: "import something from '/some/absolute/path/with'",
    },
    {
      code: "import something from '../some/relative/path/with/index'",
      errors: [
        {
          messageId: 'removeIndex',
          data: { value: '../some/relative/path/with/index' },
        },
      ],
      output: "import something from '../some/relative/path/with'",
    },
    {
      code: "import something from '.'",
      errors: [
        {
          messageId: 'addIndex',
          data: { value: '.' },
        },
      ],
      output: "import something from './index'",
    },
    {
      code: "import something from './.././..'",
      errors: [
        {
          messageId: 'addIndex',
          data: { value: './.././..' },
        },
      ],
      output: "import something from './.././../index'",
    },
  ],
});
