const ruleTester = require('../../../utils/rule-tester');
const rule = require('./index');

jest.mock('../../../utils/require-resolve', () => ({
  // Always resolve as srcRoot relative paths
  requireResolve: thePath => `${thePath}/index.js`,
}));

ruleTester.run('no-restricted-paths', rule, {
  valid: [
    {
      // target: doesn't match - relative target + relative import
      code: "import { RelativeTarget } from '../controllers/my-controller'",
      filename: './ui/foo.js',
      options: [
        {
          restrictions: [
            {
              from: './controllers',
              target: './services',
            },
          ],
        },
      ],
    },
    {
      // target: doesn't match - absolute target + relative import
      code: "import { AbsoluteTarget } from '../controllers/my-controller'",
      filename: '/Users/test/src/ui/foo.js',
      options: [
        {
          restrictions: [
            {
              from: '/Users/test/src/controllers',
              target: '/Users/test/src/services',
            },
          ],
        },
      ],
    },
    {
      // target: relative target + project-relative import
      code: "import { AbsoluteImportRelativeTarget } from 'controllers/my-controller'",
      filename: '/Users/test/src/ui/foo.js',
      options: [
        {
          basePath: '/Users/test/src',
          restrictions: [
            {
              from: './controllers',
              target: './services',
            },
          ],
        },
      ],
    },
    {
      // target: absolute target + project-relative import
      code: "import { AbsoluteImportAndTarget } from 'controllers/my-controller'",
      filename: '/Users/test/src/ui/foo.js',
      options: [
        {
          basePath: '/Users/test/src',
          restrictions: [
            {
              from: '/Users/test/src/controllers',
              target: '/Users/test/src/services',
            },
          ],
        },
      ],
    },
    {
      // target: doesn't match - relative + basePath
      code: "import { RelativeWithBasePath } from '../controllers/my-controller'",
      filename: '/Users/test/src/other-pkg/src/services/foo.js',
      options: [
        {
          basePath: '/Users/test/src/my-pkg/src',
          restrictions: [
            {
              from: './controllers',
              target: './services',
            },
          ],
        },
      ],
    },
    {
      // target: doesn't match - relative + basePath + srcRoot + project-relative import
      code: "import { RelativeWithBasePath } from 'controllers/my-controller'",
      filename: '/Users/test/src/other-pkg/src/services/foo.js',
      options: [
        {
          basePath: '/Users/test/src/my-pkg/src',
          srcRoot: '/Users/test/src',
          restrictions: [
            {
              from: './controllers',
              target: './services',
            },
          ],
        },
      ],
    },
    {
      // target: multiple targets don't match
      code: "import { MultipleTargets } from '../controllers/my-controller'",
      filename: './ui/foo.js',
      options: [
        {
          restrictions: [
            {
              from: './controllers',
              target: ['./util', './common'],
            },
          ],
        },
      ],
    },
    {
      // from: doesn't match
      code: "import { FromPath } from './controllers'",
      filename: './services/foo.js',
      options: [
        {
          restrictions: [
            {
              from: './secret',
              target: './services',
            },
          ],
        },
      ],
    },
    {
      // from: doesn't match same dirname in different hierarchy
      code: "import { FromPathHierarchy } from './controllers'",
      filename: './services/foo.js',
      options: [
        {
          restrictions: [
            {
              from: './controllers',
              target: './services',
            },
          ],
        },
      ],
    },
  ],
  invalid: [
    {
      // empty config does not do anything
      code: 'const foo = "whatever"',
      filename: './services/foo.js',
      options: [],
      errors: [{ messageId: 'provideConfig' }],
    },
    {
      /*
       * multiple rules, only one report
       */
      code: "import { MultipleRules } from '../controllers/my-controller'",
      filename: './services/foo.js',
      options: [
        {
          restrictions: [
            {
              from: './controllers',
              target: './services',
            },
            {
              from: './ui',
              target: './services',
            },
            {
              from: './secret',
              target: './services',
            },
          ],
        },
      ],
      errors: [
        {
          messageId: 'invalidImport',
          data: {
            from: './controllers',
            target: './services',
            message: '',
          },
        },
      ],
    },
    {
      // test absolute target + relative import
      code: "import { AbsoluteTargetRelativeImport } from '../../../uncommon/util/'",
      filename: '/Users/test/src/ui/dialog/body/main.js',
      options: [
        {
          restrictions: [
            {
              from: '/Users/test/src/uncommon',
              target: '/Users/test/src/ui',
            },
          ],
        },
      ],
      errors: [
        {
          messageId: 'invalidImport',
          data: {
            from: '/Users/test/src/uncommon',
            target: '/Users/test/src/ui',
            message: '',
          },
        },
      ],
    },
    {
      // test relative target + import
      code: "import { RelativePathAndImport } from '../../../uncommon/util/'",
      filename: './ui/dialog/body/main.js',
      options: [
        {
          restrictions: [
            {
              from: './uncommon',
              target: './ui',
            },
          ],
        },
      ],
      errors: [
        {
          messageId: 'invalidImport',
          data: {
            from: './uncommon',
            target: './ui',
            message: '',
          },
        },
      ],
    },
    {
      // test absolute target + project-relative import
      code: "import { AbsoluteTargetAndImport } from 'uncommon/util/'",
      filename: '/Users/test/src/ui/dialog/body/main.js',
      options: [
        {
          basePath: '/Users/test/src',
          restrictions: [
            {
              from: '/Users/test/src/uncommon',
              target: '/Users/test/src/ui',
            },
          ],
        },
      ],
      errors: [
        {
          messageId: 'invalidImport',
          data: {
            from: '/Users/test/src/uncommon',
            target: '/Users/test/src/ui',
            message: '',
          },
        },
      ],
    },
    {
      // test relative target + project-relative import
      code: "import { RelativeTargetAbsoluteImport } from 'uncommon/util/'",
      filename: '/Users/test/src/ui/dialog/body/main.js',
      options: [
        {
          basePath: '/Users/test/src',
          restrictions: [
            {
              from: './uncommon',
              target: './ui',
            },
          ],
        },
      ],
      errors: [
        {
          messageId: 'invalidImport',
          data: {
            from: './uncommon',
            target: './ui',
            message: '',
          },
        },
      ],
    },
    {
      // test relative path without ./
      code: "import { AnotherRelativePathTest } from '../../../uncommon/util/'",
      filename: './ui/dialog/body/main.js',
      options: [
        {
          restrictions: [
            {
              from: 'uncommon',
              target: 'ui',
            },
          ],
        },
      ],
      errors: [
        {
          messageId: 'invalidImport',
          data: {
            from: 'uncommon',
            target: 'ui',
            message: '',
          },
        },
      ],
    },
    {
      // test basePath + srcRoot + project-relative import
      code: "import { RelativeWithBasePath } from 'my-pkg/src/controllers/my-controller'",
      filename: '/Users/test/src/my-pkg/src/services/foo.js',
      options: [
        {
          basePath: '/Users/test/src/my-pkg/src',
          srcRoot: '/Users/test/src',
          restrictions: [
            {
              from: './controllers',
              target: './services',
            },
          ],
        },
      ],
      errors: [
        {
          messageId: 'invalidImport',
          data: {
            from: './controllers',
            target: './services',
            message: '',
          },
        },
      ],
    },
    {
      // test basePath + srcRoot + project-relative import
      code: "import { RelativeWithBasePath } from 'my-pkg/src/controllers/my-controller'",
      filename: '/Users/test/src/my-pkg/src/services/foo.js',
      options: [
        {
          basePath: '/Users/test/src/my-pkg/src',
          srcRoot: '/Users/test/src',
          restrictions: [
            {
              from: './controllers',
              target: './services',
            },
          ],
        },
      ],
      errors: [
        {
          messageId: 'invalidImport',
          data: {
            from: './controllers',
            target: './services',
            message: '',
          },
        },
      ],
    },
    {
      // from as array
      code: "import { FromArray } from '../../../secret/util/'",
      filename: './ui/dialog/body/main.js',
      options: [
        {
          restrictions: [
            {
              from: ['uncommon', 'secret'],
              target: 'ui',
            },
          ],
        },
      ],
      errors: [
        {
          messageId: 'invalidImport',
          data: {
            from: 'secret',
            target: 'ui',
            message: '',
          },
        },
      ],
    },
    {
      // from as array with multiple violations
      code: `import { MultiViolationArrayOne } from '../../../uncommon/util/';
                   import { MultiViolationArrayTwo } from '../../../secret/util/';
                   import { Normal } from '../../../services/';
            `,
      filename: './ui/dialog/body/main.js',
      options: [
        {
          restrictions: [
            {
              from: ['uncommon', 'secret'],
              target: 'ui',
            },
          ],
        },
      ],
      errors: [
        {
          messageId: 'invalidImport',
          data: {
            from: 'uncommon',
            target: 'ui',
            message: '',
          },
        },
        {
          messageId: 'invalidImport',
          data: {
            from: 'secret',
            target: 'ui',
            message: '',
          },
        },
      ],
    },
    {
      // multiple violations
      code: `import { MultiViolationOne } from '../../../uncommon/util/';
                   import { MultiViolationTwo } from '../../../secret/util/';
                   import { Normal } from '../../../services/';
            `,
      filename: './ui/dialog/body/main.js',
      options: [
        {
          restrictions: [
            {
              from: 'uncommon',
              target: 'ui',
            },
            {
              from: 'secret',
              target: 'ui',
            },
          ],
        },
      ],
      errors: [
        {
          messageId: 'invalidImport',
          data: {
            from: 'uncommon',
            target: 'ui',
            message: '',
          },
        },
        {
          messageId: 'invalidImport',
          data: {
            from: 'secret',
            target: 'ui',
            message: '',
          },
        },
      ],
    },
    {
      // custom message
      code: "import { CustomMessage } from '../../../uncommon/util/'",
      filename: './ui/dialog/body/main.js',
      options: [
        {
          restrictions: [
            {
              from: 'uncommon',
              target: 'ui',
            },
          ],
          message: 'custom message',
        },
      ],
      errors: [
        {
          messageId: 'invalidImport',
          data: {
            from: 'uncommon',
            target: 'ui',
            message: '; custom message',
          },
        },
      ],
    },
    {
      // Matching relative target with basePath
      code: "import { RelativeWithBasePath } from '../controllers/my-controller'",
      filename: '/Users/test/src/my-pkg/src/services/foo.js',
      options: [
        {
          basePath: '/Users/test/src/my-pkg/src',
          restrictions: [
            {
              from: './controllers',
              target: './services',
            },
          ],
        },
      ],
      errors: [
        {
          messageId: 'invalidImport',
          data: {
            from: './controllers',
            target: './services',
            message: '',
          },
        },
      ],
    },
    {
      // Matching absolute target with basePath
      code: "import { AbsoluteWithBasePath } from '../controllers/my-controller'",
      filename: '/Users/test/src/my-pkg/src/services/foo.js',
      options: [
        {
          basePath: '/Users/test/src/my-pkg/src',
          restrictions: [
            {
              from: '/Users/test/src/my-pkg/src/controllers',
              target: '/Users/test/src/my-pkg/src/services',
            },
          ],
        },
      ],
      errors: [
        {
          messageId: 'invalidImport',
          data: {
            from: '/Users/test/src/my-pkg/src/controllers',
            target: '/Users/test/src/my-pkg/src/services',
            message: '',
          },
        },
      ],
    },
    {
      // target as array
      code: "import { TargetArray } from '../../../secret/util/'",
      filename: './ui/dialog/body/main.js',
      options: [
        {
          restrictions: [
            {
              from: 'secret',
              target: ['ui', 'controllers'],
            },
          ],
        },
      ],
      errors: [
        {
          messageId: 'invalidImport',
          data: {
            from: 'secret',
            target: 'ui',
            message: '',
          },
        },
      ],
    },
    {
      // Path matching a file source
      code: "import { FileMatching } from '../main.js'",
      filename: './util/foo.js',
      options: [
        {
          restrictions: [
            {
              from: './main.js',
              target: './util',
            },
          ],
        },
      ],
      errors: [
        {
          messageId: 'invalidImport',
          data: {
            from: './main.js',
            target: './util',
            message: '',
          },
        },
      ],
    },
  ],
});
