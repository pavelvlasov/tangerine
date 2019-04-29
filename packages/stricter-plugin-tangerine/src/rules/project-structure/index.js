/* eslint-disable no-param-reassign */
const fs = require('fs');
const path = require('path');
const omit = require('lodash.omit');
const uniq = require('lodash.uniq');
const sortBy = require('lodash.sortby');
const pathIsInside = require('path-is-inside');

const FILE = 'file';
const DIR = 'dir';
const ASTERISK = '*';
const ROOT = '.';

const getRequirements = (struct, valueFilter) => {
  const rest = omit(struct, ASTERISK);

  const result = Object.entries(rest).reduce(
    (acc, [key, value]) => {
      if (valueFilter && !valueFilter(value)) {
        return acc;
      }

      if (value.type) {
        (value.optional ? acc.optional : acc.required)[key] = {
          type: value.type,
        };
      } else {
        acc.required[key] = value;
      }

      return acc;
    },
    { required: {}, optional: {} },
  );

  return result;
};

const filesMatch = (files, struct) => {
  const fileRequirements = getRequirements(struct, i => i.type === FILE);

  if (!files.length) {
    if (!Object.keys(fileRequirements.required).length) {
      return { isMatch: true };
    }

    return { isMatch: false, missing: fileRequirements.required };
  }

  const result = files.reduce(
    ({ required, optional, extra }, i) => {
      if (required[i] && !required[i].found) {
        required[i].found = true;
      } else if (optional[i] && !optional[i].found) {
        optional[i].found = true;
      } else {
        extra[i] = { type: FILE };
      }

      return { required, optional, extra };
    },
    { required: fileRequirements.required, optional: fileRequirements.optional, extra: {} },
  );

  const matchResult = { isMatch: true };

  const missingRequiredFiles = !Object.values(result.required).every(i => i.found === true);
  if (missingRequiredFiles) {
    const missing = Object.entries(result.required).reduce((acc, [key, value]) => {
      if (!value.found) {
        acc[key] = value;
        delete value.found;
      }

      return acc;
    }, {});

    matchResult.isMatch = false;
    matchResult.missing = missing;
  }

  const { [ASTERISK]: asterisk } = struct;
  if (Object.keys(result.extra).length) {
    if (
      !(
        asterisk &&
        (asterisk.type === FILE ||
          (asterisk instanceof Array && asterisk.some(i => i.type === FILE)))
      )
    ) {
      matchResult.isMatch = false;
      matchResult.extra = result.extra;
    }
  }

  return matchResult;
};

const resolveDefinitionAlias = (alias, definitionsByName) => {
  let result = alias;
  const visited = {};

  while (result.type && result.type !== FILE && result.type !== DIR) {
    if (!definitionsByName[result.type]) {
      throw new Error(`Definition for ${result.type} is not found`);
    }

    if (visited[result.type]) {
      throw new Error(`Definition for ${alias.type} contains a circular reference`);
    }

    visited[result.type] = true;
    result = definitionsByName[result.type];
  }

  return result;
};

const matchHierarchy = (currentPath, childrenByDir, definition, definitionsByName) => {
  const resolvedDefinition = resolveDefinitionAlias(definition, definitionsByName);
  const children = childrenByDir[currentPath];
  const fileMatch = filesMatch(children.files, resolvedDefinition);
  // eslint-disable-next-line no-use-before-define
  const dirMatch = dirsMatch(
    currentPath,
    children.dirs,
    childrenByDir,
    resolvedDefinition,
    definitionsByName,
  );

  if (fileMatch.isMatch && dirMatch.isMatch) {
    return { isMatch: true };
  }

  const result = { isMatch: false };

  if (!fileMatch.isMatch) {
    result.files = fileMatch;
  }

  if (!dirMatch.isMatch) {
    result.dirs = dirMatch;
  }

  return result;
};

const dirsMatch = (currentPath, dirs, childrenByDir, struct, definitionsByName) => {
  const dirRequirements = getRequirements(struct, i => i.type !== FILE);

  if (!dirs.length) {
    if (!Object.keys(dirRequirements.required).length) {
      return { isMatch: true };
    }

    return { isMatch: false, missing: dirRequirements.required };
  }

  const result = dirs.reduce(
    ({ required, optional, extra }, i) => {
      const currentRequired = required[i];
      const currentOptional = optional[i];

      if (currentRequired && !currentRequired.found) {
        if (currentRequired.type === DIR) {
          currentRequired.found = true;
        } else {
          const match = matchHierarchy(
            path.join(currentPath, i),
            childrenByDir,
            currentRequired.type ? definitionsByName[currentRequired.type] : currentRequired,
            definitionsByName,
          );

          currentRequired.found = match.isMatch;
          currentRequired.matches = currentRequired.matches || [];
          currentRequired.matches.push(match);
        }
      } else if (currentOptional && !currentOptional.found) {
        if (currentOptional.type === DIR) {
          currentOptional.found = true;
        } else {
          const match = matchHierarchy(
            path.join(currentPath, i),
            childrenByDir,
            currentOptional.type ? definitionsByName[currentOptional.type] : currentOptional,
            definitionsByName,
          );

          currentOptional.found = match.isMatch;
          currentOptional.matches = currentOptional.matches || [];
          currentOptional.matches.push(match);
        }
      } else {
        extra[i] = { type: DIR };
      }

      return { required, optional, extra };
    },
    { required: dirRequirements.required, optional: dirRequirements.optional, extra: {} },
  );

  const matchResult = { isMatch: true };

  const missingRequiredDirs = !Object.values(result.required).every(i => i.found === true);
  if (missingRequiredDirs) {
    const missing = Object.entries(result.required).reduce((acc, [key, value]) => {
      if (!value.found) {
        acc[key] = value;
        delete value.found;
      }

      return acc;
    }, {});

    matchResult.isMatch = false;
    matchResult.missing = missing;
  }

  const mismatchingOptionalDirs = Object.values(result.optional).some(i => i.found === false);
  if (mismatchingOptionalDirs) {
    const missing = Object.entries(result.optional).reduce((acc, [key, value]) => {
      if (value.found === false) {
        acc[key] = value;
        delete value.found;
      }

      return acc;
    }, {});

    matchResult.isMatch = false;
    matchResult.missing = missing;
  }

  const { [ASTERISK]: asterisk } = struct;
  const extraDirs = Object.keys(result.extra);
  if (extraDirs.length) {
    if (!asterisk || asterisk.type === FILE) {
      matchResult.isMatch = false;
      matchResult.extra = result.extra;
      return matchResult;
    }

    const asteriskArray = asterisk instanceof Array ? asterisk : [asterisk];

    if (asteriskArray.some(i => i.type === DIR)) {
      return matchResult;
    }

    const notFileAsterisk = asteriskArray.filter(j => j.type !== FILE);
    const extra = extraDirs.reduce((acc, i) => {
      if (!notFileAsterisk.length) {
        acc[i] = { type: DIR };
        return acc;
      }

      const matches = notFileAsterisk.map(j =>
        matchHierarchy(
          path.join(currentPath, i),
          childrenByDir,
          definitionsByName[j.type],
          definitionsByName,
        ),
      );

      if (matches.some(j => j.isMatch)) {
        return acc;
      }

      acc[i] = { type: DIR, matches };
      return acc;
    }, {});

    if (Object.keys(extra).length !== 0) {
      matchResult.isMatch = false;
      matchResult.extra = extra;
    }
  }

  return matchResult;
};

const getDirObject = root => {
  const stack = [root];
  const result = {};

  while (stack.length) {
    const curr = stack.pop();
    const children = fs.readdirSync(curr);
    const dirs = [];
    const files = [];

    children.forEach(i => {
      const absolutePath = path.join(curr, i);

      if (fs.statSync(absolutePath).isDirectory()) {
        dirs.push(i);
        stack.push(absolutePath);
      } else {
        files.push(i);
      }
    });

    result[curr] = {
      dirs,
      files,
    };
  }

  return result;
};

const readDir = filePaths => {
  const uniqueDirs = uniq(filePaths.map(file => path.dirname(file)));
  const result = sortBy(uniqueDirs, i => i.split(path.sep).length).reduce((acc, dir) => {
    if (!Object.keys(acc).some(rootDir => pathIsInside(dir, rootDir))) {
      acc[dir] = getDirObject(dir);
    }
    return acc;
  }, {});

  return result;
};

const prepareStruct = struct => {
  const convertValue = valueToConvert => {
    if (typeof valueToConvert === 'string') {
      return {
        type: valueToConvert,
        optional: false,
      };
    } else if (valueToConvert instanceof Array) {
      return valueToConvert.map(convertValue);
    } else if (typeof valueToConvert.type === 'undefined') {
      return Object.entries(valueToConvert).reduce((acc, [key, value]) => {
        acc[key] = convertValue(value);
        return acc;
      }, {});
    }

    return valueToConvert;
  };

  const mergeValues = (a, b, key) => {
    if (a.type) {
      if (a.type !== DIR) {
        throw new Error(`Trying to merge incompatible definitions for ${key}`);
      }

      return b;
    } else if (b.type) {
      if (b.type !== DIR) {
        throw new Error(`Trying to merge incompatible definitions for ${key}`);
      }

      return a;
    }

    const result = {};
    Object.keys(a).reduce((acc, k) => {
      if (b[k]) {
        acc[k] = mergeValues(a[k], b[k], k);
      } else {
        acc[k] = a[k];
      }

      return acc;
    }, result);

    Object.keys(b).reduce((acc, k) => {
      if (!a[k]) {
        acc[k] = b[k];
      }

      return acc;
    }, result);

    return result;
  };

  // TODO: handle non-root-level path expansion
  const expandedPaths = Object.keys(struct)
    .filter(i => i.includes(path.sep))
    .map(i => i.split(path.sep));
  const result = Object.entries(struct).reduce((agg, [key, value]) => {
    if (key.includes(path.sep)) {
      const splitKey = key.split(path.sep);
      const newKey = splitKey.shift();
      const expandedValue = splitKey.reduceRight(
        (acc, i) => ({
          [i]: acc,
        }),
        value,
      );

      const convertedValue = convertValue(expandedValue);

      const existingValue = agg[newKey];
      agg[newKey] = existingValue
        ? mergeValues(convertedValue, existingValue, newKey)
        : convertedValue;
    } else {
      const convertedValue = convertValue(value);
      const existingValue = agg[key];

      agg[key] = existingValue ? mergeValues(convertedValue, existingValue, key) : convertedValue;
    }

    return agg;
  }, {});

  expandedPaths.forEach(pathList => {
    let currNode = result;
    let i = 0;

    while (i < pathList.length) {
      if (!currNode[ASTERISK]) {
        currNode[ASTERISK] = [{ type: DIR, optional: false }, { type: FILE, optional: false }];
      }

      currNode = currNode[pathList[i]];
      i += 1;
    }
  });

  return result;
};

const processMismatches = (match, prefix = '.') => {
  const { sep } = path;
  const result = [];

  if (match.isMatch) {
    return result;
  }

  if (match.files) {
    if (match.files.missing) {
      result.push(...Object.keys(match.files.missing).map(i => `Missing file ${prefix}${sep}${i}`));
    }

    if (match.files.extra) {
      result.push(
        ...Object.keys(match.files.extra).map(i => `Could not match file ${prefix}${sep}${i}`),
      );
    }
  }

  if (match.dirs) {
    if (match.dirs.missing) {
      result.push(
        ...Object.entries(match.dirs.missing).reduce((acc, [dir, mismatch]) => {
          if (!mismatch.matches) {
            return acc.concat(`Missing directory ${prefix}${sep}${dir}`);
          }

          const processedMismatches = mismatch.matches.reduce(
            (innerAcc, innerMatch) =>
              innerAcc.concat(processMismatches(innerMatch, `${prefix}${sep}${dir}`)),
            [],
          );

          return acc.concat(processedMismatches);
        }, []),
      );
    }

    if (match.dirs.extra) {
      result.push(
        ...Object.entries(match.dirs.extra).reduce((acc, [dir, mismatch]) => {
          if (!mismatch.matches) {
            return acc.concat(`Extra directory ${prefix}${sep}${dir}`);
          }

          const processedMismatches = mismatch.matches.reduce(
            (innerAcc, innerMatch) =>
              innerAcc.concat(processMismatches(innerMatch, `${prefix}${sep}${dir}`)),
            [],
          );

          return acc.concat(processedMismatches);
        }, []),
      );
    }
  }

  return result;
};

const performMatch = (currentPath, childrenByDir, definitionsByName) => {
  const rootDefinition = definitionsByName[ROOT];

  if (!rootDefinition) {
    throw new Error(`${ROOT} is required on the root level of definitions`);
  }

  if (definitionsByName[ASTERISK]) {
    throw new Error(
      `${ASTERISK} is not allowed on the root level of definitions, consider moving it below ${ROOT}`,
    );
  }

  const restDefinitions = omit(definitionsByName, ROOT);
  const result = matchHierarchy(currentPath, childrenByDir, rootDefinition, restDefinitions);

  return result;
};

module.exports = {
  filesMatch,
  dirsMatch,
  matchHierarchy,
  prepareStruct,
  processMismatches,
  performMatch,
  readDir,
  resolveDefinitionAlias,
  onProject: ({ files, config }) => {
    const definitions = prepareStruct(config.definitions);
    const errorTemplate = config.errorTemplate || '#messages#';
    const childrenByDirMap = readDir(Object.keys(files));
    const result = Object.entries(childrenByDirMap).reduce((acc, [root, childrenByDir]) => {
      const matchResult = performMatch(root, childrenByDir, definitions);
      const mismatches = processMismatches(matchResult, root);

      return acc.concat(mismatches);
    }, []);

    return result.map(error => `${errorTemplate}`.replace('#messages#', error));
  },
  meta: {
    docs: {
      description: 'Enforce a specific file structure for your project',
    },
  },
};
