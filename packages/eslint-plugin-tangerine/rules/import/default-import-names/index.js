/**
 * @file Enforce consistent **default import** names for specified sources
 */

const getOptionForSource = (options, source) =>
  options &&
  options.find(option => {
    if (option.source instanceof RegExp) {
      return option.source.test(source);
    }
    return option.source === source;
  });

module.exports = {
  meta: {
    docs: {
      description: 'Enforce consistent default import names for specified sources',
    },
    fixable: 'code',
    messages: {
      invalidDefaultImportName:
        "Invalid default name '{{current}}' for import from '{{source}}'; use '{{expected}}' instead",
    },
    schema: [
      {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            source: {}, // type: ['string', 'RegExp'] - doesn't work in rule runner
            name: { type: 'string' },
          },
          additionalProperties: false,
        },
        additionalItems: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0];

    return {
      'ImportDeclaration > ImportDefaultSpecifier': node => {
        const importNode = node.parent;
        if (importNode.source && importNode.source.value) {
          const source = importNode.source.value;
          const option = getOptionForSource(options, source);
          if (!option) {
            return;
          }

          if (node.local.name !== option.name) {
            context.report({
              node,
              messageId: 'invalidDefaultImportName',
              data: {
                current: node.local.name,
                expected: option.name,
                source,
              },
              fix: fixer => fixer.replaceText(node, option.name),
            });
          }
        }
      },
    };
  },
};
