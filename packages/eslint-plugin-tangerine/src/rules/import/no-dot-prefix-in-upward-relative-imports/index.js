/**
 * @file Remove leading `./` in relative imports from other folders
 * E.g. should use `'../fileName'` instead of `'./../fileName'`
 */

module.exports = {
  meta: {
    docs: {
      description: 'Remove leading `./` in relative imports from other folders',
    },
    fixable: 'code',
    messages: {
      unnecessaryImportPrefix: "Unnecessary dot prefix in '{{source}}'",
    },
  },

  create(context) {
    return {
      ImportDeclaration: node => {
        if (!node || !node.source || node.source.value == null) return;

        const source = node.source.value;

        if (source.startsWith('./..')) {
          context.report({
            node,
            messageId: 'unnecessaryImportPrefix',
            data: {
              source,
            },
            fix: fixer =>
              fixer.replaceTextRange(node.source.range, `'${source.replace(/^\.\//, '')}'`),
          });
        }
      },
    };
  },
};
