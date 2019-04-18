/**
 * @file Allow to specify import restrictions between different paths in your application.
 */
const path = require('path');
const pathIsInside = require('path-is-inside');
const { resolveImport } = require('../../../utils/resolve');

const isParentImport = (resolvedMatchDir, importSource, currentDir, srcRoot) => {
  const resolvedSource = resolveImport(importSource, srcRoot, currentDir);
  if (!resolvedSource) {
    return false;
  }
  const sourceInsideDir = pathIsInside(resolvedSource, resolvedMatchDir);
  const sameParentDir = pathIsInside(resolvedSource, currentDir);

  return sourceInsideDir && !sameParentDir;
};

module.exports = {
  meta: {
    docs: {
      description: 'Restrict imports from parent paths in specific directories',
    },
    schema: [
      {
        type: 'object',
        properties: {
          basePath: {
            type: 'string',
          },
          dirs: {
            type: 'array',
            items: {
              type: 'string',
            },
            minItems: 1,
          },
          message: {
            type: 'string',
          },
          srcRoot: {
            type: 'string',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      invalidImport: "Importing from a parent inside '{{dir}}' is not allowed{{message}}",
      provideConfig:
        'This rule does nothing by default; either provide options or disable the rule',
    },
  },

  create(context) {
    const configOptions = context.options[0];
    if (!configOptions || !configOptions.dirs || configOptions.dirs.length === 0) {
      context.report({
        messageId: 'provideConfig',
        loc: {
          start: { line: 1, column: 1 },
          end: { line: 1, column: 1 },
        },
      });

      return {};
    }

    const currentFilepath = path.resolve(context.getFilename());
    const currentDir = path.resolve(path.dirname(currentFilepath));

    const basePath = configOptions.basePath || process.cwd();
    const srcRoot = configOptions.srcRoot || basePath;

    const matchedDir = configOptions.dirs.find(dir => {
      const dirPath = path.resolve(basePath, dir);
      return pathIsInside(currentFilepath, dirPath);
    });

    if (!matchedDir) {
      return {};
    }
    const resolvedMatchedDir = path.resolve(basePath, matchedDir);

    return {
      ImportDeclaration: node => {
        if (!node || !node.source || !node.source.value) return;

        if (!isParentImport(resolvedMatchedDir, node.source.value, currentDir, srcRoot)) {
          return;
        }

        const message = configOptions.message ? `; ${configOptions.message}` : '';

        context.report({
          node: node.source,
          messageId: 'invalidImport',
          data: {
            dir: matchedDir,
            message,
          },
        });
      },
    };
  },
};
