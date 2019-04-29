const ruleTester = require('../../../utils/rule-tester');
const rule = require('./index');

const validAlphabeticalFormatted = require('./test-data/imports/valid-alphabetical-formatted');
const validAlphabeticalFormattedSimple = require('./test-data/imports/valid-alphabetical-formatted-simple');
const validAlphabeticalNonFormatted = require('./test-data/imports/valid-alphabetical-non-formatted');
const validNonAlphabeticalFormatted = require('./test-data/imports/valid-non-alphabetical-formatted');
const validNonAlphabeticalNonFormatted = require('./test-data/imports/valid-non-alphabetical-non-formatted');
const validCategoryOrder = require('./test-data/imports/valid-category-order');
const validModulesRegexOrder = require('./test-data/imports/valid-modules-regex-order');
const validAbsoluteImportsFolderStructure = require('./test-data/imports/valid-absolute-imports-folder-structure');
const validAbsoluteImportsRegexOrder = require('./test-data/imports/valid-absolute-imports-regex-order');
const validRelativeImportsUpDepth = require('./test-data/imports/valid-relative-imports-up-depth');
const validRelativeImportsUpRegexOrder = require('./test-data/imports/valid-relative-imports-up-regex-order');
const validRelativeImportsDownFolderStructure = require('./test-data/imports/valid-relative-imports-down-folder-structure');
const validRelativeImportsUpFolderStructure = require('./test-data/imports/valid-relative-imports-up-folder-structure');
const validRelativeImportsDownRegexOrder = require('./test-data/imports/valid-relative-imports-down-regex-order');

const invalidCategoryOrder = require('./test-data/imports/invalid-category-order');
const invalidModulesRegexOrder = require('./test-data/imports/invalid-modules-regex-order');
const invalidAbsoluteImportsFolderStructure = require('./test-data/imports/invalid-absolute-imports-folder-structure');
const invalidAbsoluteImportsRegexOrder = require('./test-data/imports/invalid-absolute-imports-regex-order');
const invalidRelativeImportsUpDepth = require('./test-data/imports/invalid-relative-imports-up-depth');
const invalidRelativeImportsUpFolderStructure = require('./test-data/imports/invalid-relative-imports-up-folder-structure');
const invalidRelativeImportsUpRegexOrder = require('./test-data/imports/invalid-relative-imports-up-regex-order');
const invalidRelativeImportsDownFolderStructure = require('./test-data/imports/invalid-relative-imports-down-folder-structure');
const invalidRelativeImportsDownRegexOrder = require('./test-data/imports/invalid-relative-imports-down-regex-order');

const error = {
  messageId: 'invalidImportOrder',
};

const baseConfiguration = {
  srcRoots: [`${__dirname}/test-data/test-files`],
  moduleImports: [[/^react/], [/^redux$/]],
  absoluteImports: [[/^b/], [/^a/]],
  relativeImports: [/^common$/],
  enforceAlphabeticalOrder: true,
  enforceFormatting: true,
};

ruleTester.run('import/order', rule, {
  valid: [
    {
      code: validAlphabeticalFormatted,
      options: [Object.assign({}, baseConfiguration, {})],
    },
    {
      code: validAlphabeticalFormattedSimple,
      options: [
        Object.assign({}, baseConfiguration, {
          simpleFormattingCount: 999,
        }),
      ],
    },
    {
      code: validAlphabeticalNonFormatted,
      options: [
        Object.assign({}, baseConfiguration, {
          enforceFormatting: false,
        }),
      ],
    },
    {
      code: validNonAlphabeticalFormatted,
      options: [
        Object.assign({}, baseConfiguration, {
          enforceAlphabeticalOrder: false,
        }),
      ],
    },
    {
      code: validNonAlphabeticalNonFormatted,
      options: [
        Object.assign({}, baseConfiguration, {
          enforceFormatting: false,
          enforceAlphabeticalOrder: false,
        }),
      ],
    },
  ],
  invalid: [
    {
      code: validAlphabeticalNonFormatted,
      options: [Object.assign({}, baseConfiguration, {})],
      output: validAlphabeticalFormatted,
      errors: [error],
    },
    {
      code: validNonAlphabeticalFormatted,
      options: [Object.assign({}, baseConfiguration, {})],
      output: validAlphabeticalFormatted,
      errors: [error],
    },
    {
      code: validNonAlphabeticalNonFormatted,
      options: [Object.assign({}, baseConfiguration, {})],
      output: validAlphabeticalFormatted,
      errors: [error],
    },
    {
      code: invalidCategoryOrder,
      options: [
        Object.assign({}, baseConfiguration, {
          enforceFormatting: false,
          enforceAlphabeticalOrder: false,
        }),
      ],
      output: validCategoryOrder,
      errors: [error],
    },
    {
      code: invalidModulesRegexOrder,
      options: [
        Object.assign({}, baseConfiguration, {
          enforceFormatting: false,
          enforceAlphabeticalOrder: false,
        }),
      ],
      output: validModulesRegexOrder,
      errors: [error],
    },
    {
      code: invalidAbsoluteImportsFolderStructure,
      options: [
        Object.assign({}, baseConfiguration, {
          enforceFormatting: false,
          enforceAlphabeticalOrder: false,
        }),
      ],
      output: validAbsoluteImportsFolderStructure,
      errors: [error],
    },
    {
      code: invalidAbsoluteImportsRegexOrder,
      options: [
        Object.assign({}, baseConfiguration, {
          enforceFormatting: false,
          enforceAlphabeticalOrder: false,
        }),
      ],
      output: validAbsoluteImportsRegexOrder,
      errors: [error],
    },
    {
      code: invalidRelativeImportsUpDepth,
      options: [
        Object.assign({}, baseConfiguration, {
          enforceFormatting: false,
          enforceAlphabeticalOrder: false,
        }),
      ],
      output: validRelativeImportsUpDepth,
      errors: [error],
    },
    {
      code: invalidRelativeImportsUpFolderStructure,
      options: [
        Object.assign({}, baseConfiguration, {
          enforceFormatting: false,
          enforceAlphabeticalOrder: false,
        }),
      ],
      output: validRelativeImportsUpFolderStructure,
      errors: [error],
    },
    {
      code: invalidRelativeImportsUpRegexOrder,
      options: [
        Object.assign({}, baseConfiguration, {
          enforceFormatting: false,
          enforceAlphabeticalOrder: false,
        }),
      ],
      output: validRelativeImportsUpRegexOrder,
      errors: [error],
    },
    {
      code: invalidRelativeImportsDownFolderStructure,
      options: [
        Object.assign({}, baseConfiguration, {
          enforceFormatting: false,
          enforceAlphabeticalOrder: false,
        }),
      ],
      output: validRelativeImportsDownFolderStructure,
      errors: [error],
    },
    {
      code: invalidRelativeImportsDownRegexOrder,
      options: [
        Object.assign({}, baseConfiguration, {
          enforceFormatting: false,
          enforceAlphabeticalOrder: false,
        }),
      ],
      output: validRelativeImportsDownRegexOrder,
      errors: [error],
    },
  ],
});
