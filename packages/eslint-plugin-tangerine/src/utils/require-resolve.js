/**
 * Wrapper around node's require.resolve method.
 * Allows easier mocking in tests via jest.mock.
 */
const requireResolve = thePath => {
  let resolvedPath;
  try {
    resolvedPath = require.resolve(thePath);
  } catch (e) {
    return false;
  }
  return resolvedPath;
};

module.exports = {
  requireResolve,
};
