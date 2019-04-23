const ruleTester = require('../../../utils/rule-tester');
const rule = require('./index');

const stringConfig = [{ name: 'React', source: 'react' }];
const regexConfig = [{ name: 'React', source: /^react$/ }];

const stringConfigBig = [{ name: 'React', source: 'react' }, { name: 'MyFoo', source: 'foo' }];
const regexConfigBig = [{ name: 'React', source: /^react$/ }, { name: 'MyFoo', source: /^foo$/ }];

ruleTester.run('import/default-import-names', rule, {
  valid: [
    // testing no config
    {
      code: "import React from 'react'",
    },
    {
      code: "import Foo from 'react'", // fine, bc not in config
    },

    // testing config 1
    {
      code: "import React from 'react'",
      options: [stringConfig],
    },
    {
      code: "import React from 'react'",
      options: [regexConfig],
    },
    {
      code: "import f from 'foo'", // fine, bc not in config
      options: [stringConfig],
    },
    {
      code: "import f from 'foo'",
      options: [regexConfig],
    },

    // testing config 2
    {
      code: "import React from 'react'",
      options: [stringConfigBig],
    },
    {
      code: "import React from 'react'",
      options: [regexConfigBig],
    },
    {
      code: "import MyFoo from 'foo'",
      options: [stringConfigBig],
    },
    {
      code: "import MyFoo from 'foo'",
      options: [regexConfigBig],
    },
  ],
  invalid: [
    // testing config 1
    {
      code: "import Foo from 'react'",
      options: [stringConfig],
      errors: [
        {
          messageId: 'invalidDefaultImportName',
          data: { current: 'Foo', source: 'react', expected: 'React' },
        },
      ],
      output: "import React from 'react'",
    },
    {
      code: "import Foo from 'react'",
      options: [regexConfig],
      errors: [
        {
          messageId: 'invalidDefaultImportName',
          data: { current: 'Foo', source: 'react', expected: 'React' },
        },
      ],
      output: "import React from 'react'",
    },
    {
      code: "import r from 'react'",
      options: [stringConfig],
      errors: [
        {
          messageId: 'invalidDefaultImportName',
          data: { current: 'r', source: 'react', expected: 'React' },
        },
      ],
      output: "import React from 'react'",
    },
    {
      code: "import r from 'react'",
      options: [regexConfig],
      errors: [
        {
          messageId: 'invalidDefaultImportName',
          data: { current: 'r', source: 'react', expected: 'React' },
        },
      ],
      output: "import React from 'react'",
    },

    // testing config 2
    {
      code: "import foo from 'foo'",
      options: [stringConfigBig],
      errors: [
        {
          messageId: 'invalidDefaultImportName',
          data: { current: 'foo', source: 'foo', expected: 'MyFoo' },
        },
      ],
      output: "import MyFoo from 'foo'",
    },
    {
      code: "import foo from 'foo'",
      options: [regexConfigBig],
      errors: [
        {
          messageId: 'invalidDefaultImportName',
          data: { current: 'foo', source: 'foo', expected: 'MyFoo' },
        },
      ],
      output: "import MyFoo from 'foo'",
    },
  ],
});
