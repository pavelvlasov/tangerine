const ruleTester = require('../../../utils/rule-tester');
const rule = require('./index');

jest.mock('../../../utils/require-resolve', () => ({
  // Always resolve as srcRoot relative paths
  requireResolve: thePath => `${thePath}/index.js`,
}));

ruleTester.run('no-parent-imports', rule, {
  valid: [
    {
      // Importing sibling - relative import
      code: "import { RelativeHeader } from './header.js';",
      filename: '/Users/dev/src/ui/dialog/index.js',
      options: [
        {
          basePath: '/Users/dev/src',
          dirs: ['ui'],
        },
      ],
    },
    {
      // Importing sibling - absolute import
      code: "import { AbsoluteHeader } from 'ui/dialog/header.js';",
      filename: '/Users/dev/src/ui/dialog/index.js',
      options: [
        {
          basePath: '/Users/dev/src',
          dirs: ['ui'],
        },
      ],
    },
    {
      // Importing sibling - absolute import with non-matching src root
      code: "import { AbsoluteHeaderSrcRoot } from 'ui/dialog/header.js';",
      filename: '/Users/dev/src/my-pkg/src/ui/dialog/index.js',
      options: [
        {
          basePath: '/Users/dev/src/my-pkg/src',
          srcRoot: '/Users/dev/src',
          dirs: ['ui'],
        },
      ],
    },
    {
      // Importing sibling - relative import, absolute dir
      code: "import { RelativeHeaderAbsoluteDir } from './header.js';",
      filename: '/Users/dev/src/ui/dialog/index.js',
      options: [
        {
          dirs: ['/Users/dev/src/ui'],
        },
      ],
    },
    {
      // Importing child - relative import
      code: "import { RelativeHeaderButton } from './header/button';",
      filename: './ui/dialog/index.js',
      options: [
        {
          dirs: ['ui'],
        },
      ],
    },
    {
      // Importing child - absolute import
      code: "import { AbsoluteHeaderButton } from 'ui/dialog/header/button';",
      filename: '/Users/dev/src/ui/dialog/index.js',
      options: [
        {
          basePath: '/Users/dev/src',
          dirs: ['ui'],
        },
      ],
    },
    {
      // Importing child - relative import, absolute dir
      code: "import { RelativeHeaderButtonAbsoluteDir } from './header/button';",
      filename: '/Users/dev/src/ui/dialog/index.js',
      options: [
        {
          dirs: ['/Users/dev/src/ui'],
        },
      ],
    },
    {
      // Importing sibling - relative import without basePath
      code: "import { RelativeNoBasePath } from './header.js';",
      filename: './ui/dialog/index.js',
      options: [
        {
          dirs: ['ui'],
        },
      ],
    },
    {
      // Importing sibling - relative import, multiple dirs
      code: "import { RelativeHeaderMultipleDirs } from './header.js';",
      filename: '/Users/dev/src/ui/dialog/index.js',
      options: [
        {
          basePath: '/Users/dev/src',
          dirs: ['ui', 'other'],
        },
      ],
    },
    {
      // No matching relative dir
      code: "import { NoMatchingDir } from '../something';",
      filename: '/Users/dev/src/ui/dialog/index.js',
      options: [
        {
          basePath: '/Users/dev/src',
          dirs: ['other'],
        },
      ],
    },
    {
      // No matching absolute dir
      code: "import { NoMatchingDir } from '../something';",
      filename: '/Users/dev/src/ui/dialog/index.js',
      options: [
        {
          dirs: ['/Users/dev/src/other'],
        },
      ],
    },
    {
      // Importing outside of dir
      code: "import { ImportOutsideDir } from '../../common';",
      filename: '/Users/dev/src/ui/dialog/index.js',
      options: [
        {
          basePath: '/Users/dev/src',
          dirs: ['ui'],
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
      // Importing parent - relative import
      code: "import { Relative } from '../something';",
      filename: '/Users/dev/src/ui/dialog/index.js',
      options: [
        {
          basePath: '/Users/dev/src',
          dirs: ['ui'],
        },
      ],
      errors: [
        {
          messageId: 'invalidImport',
          data: {
            dir: 'ui',
            message: '',
          },
        },
      ],
    },
    {
      // Importing parent - absolute import
      code: "import { Absolute } from 'ui/something';",
      filename: '/Users/dev/src/ui/dialog/index.js',
      options: [
        {
          basePath: '/Users/dev/src',
          dirs: ['ui'],
        },
      ],
      errors: [
        {
          messageId: 'invalidImport',
          data: {
            dir: 'ui',
            message: '',
          },
        },
      ],
    },
    {
      // Importing parent - absolute import with srcRoot
      code: "import { AbsoluteWithSrcRoot } from 'my-pkg/src/ui/something';",
      filename: '/Users/dev/src/my-pkg/src/ui/dialog/index.js',
      options: [
        {
          basePath: '/Users/dev/src/my-pkg/src',
          srcRoot: '/Users/dev/src',
          dirs: ['ui'],
        },
      ],
      errors: [
        {
          messageId: 'invalidImport',
          data: {
            dir: 'ui',
            message: '',
          },
        },
      ],
    },
    {
      // Importing parent - relative import, absolute dir
      code: "import { RelativeImportAbsoluteDir } from '../something';",
      filename: '/Users/dev/src/ui/dialog/index.js',
      options: [
        {
          dirs: ['/Users/dev/src/ui'],
        },
      ],
      errors: [
        {
          messageId: 'invalidImport',
          data: {
            dir: '/Users/dev/src/ui',
            message: '',
          },
        },
      ],
    },
    {
      // Importing cousin - relative import
      code: "import { RelativeParentButton } from '../something/button';",
      filename: '/Users/dev/src/ui/dialog/index.js',
      options: [
        {
          basePath: '/Users/dev/src',
          dirs: ['ui'],
        },
      ],
      errors: [
        {
          messageId: 'invalidImport',
          data: {
            dir: 'ui',
            message: '',
          },
        },
      ],
    },
    {
      // Importing cousin - absolute import
      code: "import { AbsoluteParentButton } from 'ui/something/button';",
      filename: '/Users/dev/src/ui/dialog/index.js',
      options: [
        {
          basePath: '/Users/dev/src',
          dirs: ['ui'],
        },
      ],
      errors: [
        {
          messageId: 'invalidImport',
          data: {
            dir: 'ui',
            message: '',
          },
        },
      ],
    },
    {
      // Importing cousin - relative import, absolute dir
      code: "import { RelativeHeaderButtonAbsoluteDir } from '../something/button';",
      filename: '/Users/dev/src/ui/dialog/index.js',
      options: [
        {
          dirs: ['/Users/dev/src/ui'],
        },
      ],
      errors: [
        {
          messageId: 'invalidImport',
          data: {
            dir: '/Users/dev/src/ui',
            message: '',
          },
        },
      ],
    },
    {
      // Importing parent - relative import without basePath
      code: "import { RelativeNoBasePath } from '../something';",
      filename: './ui/dialog/index.js',
      options: [
        {
          dirs: ['ui'],
        },
      ],
      errors: [
        {
          messageId: 'invalidImport',
          data: {
            dir: 'ui',
            message: '',
          },
        },
      ],
    },
    {
      // Importing parent - relative import, multiple dirs, only one report
      code: "import { RelativeHeaderMultipleDirs } from '../something';",
      filename: '/Users/dev/src/ui/dialog/index.js',
      options: [
        {
          basePath: '/Users/dev/src',
          dirs: ['ui', 'other'],
        },
      ],
      errors: [
        {
          messageId: 'invalidImport',
          data: {
            dir: 'ui',
            message: '',
          },
        },
      ],
    },
    {
      // Custom message
      code: "import { CustomMessage } from '../something';",
      filename: '/Users/dev/src/ui/dialog/index.js',
      options: [
        {
          basePath: '/Users/dev/src',
          dirs: ['ui'],
          message: 'See http://go/here for more details.',
        },
      ],
      errors: [
        {
          messageId: 'invalidImport',
          data: {
            dir: 'ui',
            message: '; See http://go/here for more details.',
          },
        },
      ],
    },
  ],
});
