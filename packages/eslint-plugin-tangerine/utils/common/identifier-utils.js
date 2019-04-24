const createIdentifierHandler = selector => {
  let faultyIdentifiers = [];
  let faultyNames = [];
  const identifierNodes = {};

  const setFaultyIdentifiers = identifiers => {
    faultyIdentifiers = identifiers;
    faultyNames = faultyIdentifiers.map(i => i.actualName);
    faultyNames.forEach(name => {
      identifierNodes[name] = [];
    });
  };

  const getFaultyIdentifiers = () => faultyIdentifiers;

  const selectors = {
    [`${selector} Identifier`]: node => {
      if (!faultyIdentifiers.length) {
        return;
      }

      if (node.parent && node.parent.type === 'MemberExpression' && node.parent.property === node) {
        return;
      }

      if (faultyNames.includes(node.name)) {
        identifierNodes[node.name].push(node);
      }
    },
    [`${selector} JSXIdentifier`]: node => {
      if (!faultyIdentifiers.length) {
        return;
      }

      if (faultyNames.includes(node.name)) {
        identifierNodes[node.name].push(node);
      }
    },
  };

  const createFixer = (fixer, faultyIdentifier) =>
    identifierNodes[faultyIdentifier.actualName].map(identifierNode => {
      if (identifierNode.typeAnnotation) {
        const varNameStart = identifierNode.start;
        const varNameEnd = identifierNode.typeAnnotation.start;

        return fixer.replaceTextRange([varNameStart, varNameEnd], faultyIdentifier.expectedName);
      }
      return fixer.replaceText(identifierNode, faultyIdentifier.expectedName);
    });

  return { selectors, setFaultyIdentifiers, getFaultyIdentifiers, createFixer };
};

module.exports = { createIdentifierHandler };
