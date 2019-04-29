/**
 * @file Enforces that parameters of React lifecycle methods are given the correct names, as per official documentation.
 * This is important as some lifecycle methods compare props and state from the past, or the immediate future, and
 * the parameter name describes which situation we are in (for example 'nextProps', 'prevProps').
 */
const { isNodeVariable } = require('../../../utils/common/node-utils');

const { COMPONENT_CLASS_PATTERN } = require('../../../utils/common/react-utils');
const { createIdentifierHandler } = require('../../../utils/common/identifier-utils');

const lifecycleMethodPattern = lifecycleMethod =>
  `${COMPONENT_CLASS_PATTERN} > ClassBody > MethodDefinition[key.name="${lifecycleMethod}"] > FunctionExpression`;

const findFaultyArgs = ({ expectedArgNames, functionNode }) => {
  const faultyArgs = [];
  expectedArgNames.forEach((expectedName, idx) => {
    const { params } = functionNode;
    const node = params[idx];
    if (node) {
      const actualName = node.name;
      if (isNodeVariable(node) && actualName !== expectedName) {
        faultyArgs.push({ node, actualName, expectedName });
      }
    }
  });

  return faultyArgs;
};

const methodsToArgNames = {
  componentDidUpdate: ['prevProps', 'prevState', 'snapshot'],
  getSnapshotBeforeUpdate: ['prevProps', 'prevState'],
  shouldComponentUpdate: ['nextProps', 'nextState'],
};

module.exports = {
  meta: {
    docs: {
      description: 'Enforce consistent naming of react lifecycle method arguments',
    },
    messages: {
      invalidArgName:
        "Invalid parameter name '{{actualName}}' for react lifecycle method; use '{{expectedName}}' instead",
    },
    fixable: 'code',
    schema: [],
  },
  create(context) {
    const identifierHandlers = [];

    const rule = {};

    Object.keys(methodsToArgNames).forEach(methodName => {
      const expectedArgNames = methodsToArgNames[methodName];
      const lifecycleMethodSelector = lifecycleMethodPattern(methodName);

      const handler = createIdentifierHandler(lifecycleMethodSelector);
      identifierHandlers.push(handler);

      rule[lifecycleMethodSelector] = functionNode => {
        const faultyArgs = findFaultyArgs({
          expectedArgNames,
          functionNode,
        });

        if (faultyArgs.length > 0) {
          handler.setFaultyIdentifiers(faultyArgs);
        }
      };
    });

    return Object.assign(
      rule,
      {
        'Program:exit': () => {
          identifierHandlers
            .filter(h => h.getFaultyIdentifiers().length > 0)
            .forEach(h => {
              const faultyIdentifiers = h.getFaultyIdentifiers();
              faultyIdentifiers.forEach(({ node, actualName, expectedName }) => {
                context.report({
                  node,
                  messageId: 'invalidArgName',
                  data: { actualName, expectedName },
                  fix: fixer => h.createFixer(fixer, { node, actualName, expectedName }),
                });
              });
            });
        },
      },
      ...identifierHandlers.map(h => h.selectors),
    );
  },
};
