/**
 * @file Allow to specify import restrictions between different paths in your application.
 */
const path = require('path');
const pathIsInside = require('path-is-inside');
const { resolveImport } = require('../../../utils/resolve');

const getRestrictionsForTarget = (restrictions, from, currentDir, srcRoot) => {
  let foundFrom;
  const foundRestriction = restrictions.find(restriction => {
    const resolvedFrom = resolveImport(from, srcRoot, currentDir);
    if (!resolvedFrom) {
      return false;
    }
    foundFrom = restriction.from.find(([, resolvedOptionFrom]) =>
      pathIsInside(resolvedFrom, resolvedOptionFrom),
    );
    return !!foundFrom;
  });

  return foundRestriction
    ? {
        from: foundFrom[0],
        target: foundRestriction.target,
      }
    : null;
};

const getApplicableRestrictions = (restrictions, basePath, currentFilepath) =>
  restrictions
    .map(option => {
      const from =
        option.from == null || option.from instanceof Array ? option.from : [option.from];
      const target = option.target instanceof Array ? option.target : [option.target];
      // Filter out any restrictions that don't target this file
      const matchedTarget = target.find(t => {
        const targetPath = path.resolve(basePath, t);
        return pathIsInside(currentFilepath, targetPath);
      });

      return {
        ...option,
        target: matchedTarget,
        // Resolve `from` to its full path so we don't have to do it each time in getRestrictionsForTarget
        from: from.map(s => [s, path.resolve(basePath, s)]),
      };
    })
    .filter(option => !!option.target);

module.exports = {
  meta: {
    docs: {
      description: 'Restrict imports between different parts of your app based on path matching.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          basePath: {
            type: 'string',
          },
          restrictions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                from: { type: ['string', 'array'], items: { type: 'string' } },
                target: { type: ['string', 'array'], items: { type: 'string' } },
              },
              additionalProperties: false,
            },
            minItems: 1,
          },
          srcRoot: {
            type: 'string',
          },
          message: {
            type: 'string',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      invalidImport: "Importing '{{from}}' within '{{target}}' is restricted{{message}}",
      provideConfig:
        'This rule does nothing by default; either provide options or disable the rule',
    },
  },

  create(context) {
    const configOptions = context.options[0];
    if (!configOptions || !configOptions.restrictions || configOptions.restrictions.length === 0) {
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

    const restrictions = getApplicableRestrictions(
      configOptions.restrictions,
      basePath,
      currentFilepath,
    );

    if (restrictions.length === 0) {
      // If no restrictions apply to this file, bail early
      return {};
    }

    return {
      ImportDeclaration: node => {
        if (!node || !node.source || !node.source.value) return;

        const restrictionsForTarget = getRestrictionsForTarget(
          restrictions,
          node.source.value,
          currentDir,
          srcRoot,
        ); // rules for current import statement (ImportDeclaration)
        if (!restrictionsForTarget) {
          return;
        }

        const message = configOptions.message ? `; ${configOptions.message}` : '';

        context.report({
          node: node.source,
          messageId: 'invalidImport',
          data: {
            from: restrictionsForTarget.from,
            target: restrictionsForTarget.target,
            message,
          },
        });
      },
    };
  },
};
