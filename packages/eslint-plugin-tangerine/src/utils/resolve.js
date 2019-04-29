const path = require('path');
const { requireResolve } = require('./require-resolve');

/* Resolves an import path (`thePath`) relative to `currentDir` if actually relative or to `srcRoot`
 * if it exists relative to `srcRoot` path (in fs). Otherwise, returns false.
 */
const resolveImport = (thePath, srcRoot, currentDir) => {
  if (
    thePath.startsWith(`.${path.sep}`) ||
    thePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(thePath)
  ) {
    // File relative path, just path resolve
    return path.resolve(currentDir, thePath);
  }
  // Either a srcRoot relative path or a node_module. We can't determine which without examining
  // the file system.
  return requireResolve(path.resolve(srcRoot, thePath));
};

module.exports = {
  resolveImport,
};
