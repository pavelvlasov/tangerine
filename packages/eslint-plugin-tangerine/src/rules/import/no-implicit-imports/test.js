const ruleTester = require('../../../utils/rule-tester');
const rule = require('./index');

const options = [[{ source: 'react', keepDefaultImport: true }, { source: 'foo' }]];

ruleTester.run('import/no-implicit-imports', rule, {
  valid: [
    { code: "import { Foo, type Bar } from 'react';", options },
    { code: "import { Foo, type Bar } from 'foo';", options },
    {
      code:
        "import Foo from 'foo';\n" +
        "import { Component } from 'react';\n" +
        'const x = Foo.Baz;\n' +
        'const y = Component',
      options: [[{ source: 'react', keepDefaultImport: true }]],
    },
  ],
  invalid: [
    {
      code: "import React from 'react';\nconst x = React.Component;",
      options,
      errors: [{ messageId: 'invalidMemberExpression', data: { defaultImport: 'React' } }],
      output:
        "import React from 'react';\nimport { Component } from 'react';\nconst x = Component;",
    },
    {
      code: "import Foo, { Bar } from 'foo';\nconst x = Foo.Baz;",
      options,
      errors: [{ messageId: 'invalidMemberExpression', data: { defaultImport: 'Foo' } }],
      output: "import { Bar } from 'foo';\nimport { Baz } from 'foo';\nconst x = Baz;",
    },
    {
      code: "import Foo from 'foo';\nconst x = Foo.Baz;",
      options,
      errors: [{ messageId: 'invalidMemberExpression', data: { defaultImport: 'Foo' } }],
      output: "\nimport { Baz } from 'foo';\nconst x = Baz;",
    },
  ],
});
