const _ = require('lodash');

module.exports = {
  meta: {
    docs: {
      description: 'Enforce use of explicit over implicit imports',
    },
    schema: [
      {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            source: { type: 'string' },
            keepDefaultImport: { type: 'boolean' },
          },
          additionalProperties: false,
        },
        additionalItems: false,
      },
    ],
    fixable: 'code',
    messages: {
      invalidMemberExpression:
        "Invalid use of member expression for '{{ defaultImport }}'; use explicit imports instead",
    },
  },

  create(context) {
    const sourceCode = context.getSourceCode();
    const options = context.options[0];
    const optionsBySource = _.keyBy(options, option => option.source);

    const dataByDefaultImport = {};

    return {
      ImportDeclaration: node => {
        if (
          node &&
          node.specifiers &&
          node.specifiers.length > 0 &&
          node.source &&
          node.source.value
        ) {
          const optionForSource = optionsBySource[node.source.value];

          if (optionForSource && node.specifiers[0].type === 'ImportDefaultSpecifier') {
            dataByDefaultImport[node.specifiers[0].local.name] = {
              source: node.source.value,
              importNode: node,
              keepDefaultImport: optionForSource.keepDefaultImport,
              memberExpressions: [],
            };
          }
        }
      },
      MemberExpression: node => {
        if (node && node.object && node.object.name && node.property && node.property.name) {
          const dataForDefaultImport = dataByDefaultImport[node.object.name];
          if (dataForDefaultImport) {
            dataForDefaultImport.memberExpressions.push(node);
          }
        }
      },
      'Program:exit': () => {
        Object.keys(dataByDefaultImport).forEach(defaultImport => {
          const { source, importNode, keepDefaultImport, memberExpressions } = dataByDefaultImport[
            defaultImport
          ];

          memberExpressions.forEach((node, index) => {
            const property = node.property.name;

            context.report({
              node,
              messageId: 'invalidMemberExpression',
              data: { defaultImport },
              fix: fixer => {
                const retVal = [
                  fixer.replaceText(node, property),
                  fixer.insertTextAfter(importNode, `\nimport { ${property} } from '${source}';`),
                ];

                const removeDefaultImport =
                  // configured to remove default import
                  !keepDefaultImport &&
                  // last fixed member expression
                  index === memberExpressions.length - 1;

                if (removeDefaultImport) {
                  if (importNode.specifiers.length > 1) {
                    const importWithoutDefaultImport = `import { ${importNode.specifiers
                      .slice(1)
                      .map(specifier => sourceCode.getText(specifier))
                      .join(', ')} } from '${source}';`;

                    retVal.push(fixer.replaceText(importNode, importWithoutDefaultImport));
                  } else {
                    retVal.push(fixer.remove(importNode));
                  }
                }
                return retVal;
              },
            });
          });
        });
      },
    };
  },
};
