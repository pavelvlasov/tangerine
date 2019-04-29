/**
 * @file Forbids and fixes the dangling /index in imports except for './index' and '../index'
 */

const hasDanglingIndex = value => !/^(\.\.?\/)+index$/.test(value) && /\/index$/.test(value);

const shouldHaveDanglingIndex = value =>
  /^(\.\.?\/)*\.?\.?$/.test(value) || /\.(\/){0,1}$/.test(value);

module.exports = {
  meta: {
    docs: {
      description: "Disallow unnecessary trailing '/index' in imports",
    },
    schema: [], // no options
    fixable: 'code',
    messages: {
      removeIndex: "Invalid import {{ value }}; no dangling '/index' allowed",
      addIndex: "Invalid import {{ value }}; should have dangling '/index'",
    },
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        if (node && node.source && node.source.value) {
          const { value } = node.source;
          if (hasDanglingIndex(value)) {
            context.report({
              node,
              messageId: 'removeIndex',
              data: { value },
              fix: fixer =>
                fixer.replaceTextRange(node.source.range, `'${value.replace(/\/index$/, '')}'`),
            });
          } else if (shouldHaveDanglingIndex(value)) {
            context.report({
              node,
              messageId: 'addIndex',
              data: { value },
              fix: fixer => {
                if (value.endsWith('/')) {
                  return fixer.replaceTextRange(node.source.range, `'${value}index'`);
                }
                return fixer.replaceTextRange(node.source.range, `'${value}/index'`);
              },
            });
          }
        }
      },
    };
  },
};
