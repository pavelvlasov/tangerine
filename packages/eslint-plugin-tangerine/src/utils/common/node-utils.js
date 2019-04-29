const isNodeString = node => node.type === 'Literal';
const isNodeVariable = node => node.type === 'Identifier';
const isNodeObject = node => node.type === 'ObjectExpression';
const isNodeFunctionCall = node => node.type === 'CallExpression';
const isNodeArrowFunction = node => node.type === 'ArrowFunctionExpression';

module.exports = {
  isNodeString,
  isNodeVariable,
  isNodeObject,
  isNodeFunctionCall,
  isNodeArrowFunction,
};
