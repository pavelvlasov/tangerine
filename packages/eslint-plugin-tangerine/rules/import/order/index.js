const fs = require('fs');
const path = require('path');

const groupBy = require('lodash/groupBy');
const sortBy = require('lodash/sortBy');
const findIndex = require('lodash/findIndex');
const uniq = require('lodash/uniq');
const flatten = require('lodash/flatten');

// =============
// === utils ===
// =============

const sortByRegexArray = (items, regexArray, toString = item => item) =>
  sortBy(items, item => {
    const index = findIndex(regexArray, regex => regex.test(toString(item)));
    if (index === -1) {
      return undefined;
    }
    return index;
  });

const sortByFolderStructure = (items, regexArray, index = 0) => {
  const getFolder = item => item.segments[index];

  const { folder: itemsWithFolder, 'no-folder': itemsWithoutFolder } = groupBy(items, item =>
    getFolder(item) ? 'folder' : 'no-folder',
  );

  const retVal = [];
  retVal.push(...(itemsWithoutFolder || []));

  if (itemsWithFolder) {
    const itemsPerFolder = groupBy(itemsWithFolder, getFolder);

    let folders = uniq(itemsWithFolder.map(getFolder));
    if (regexArray) {
      folders = sortByRegexArray(folders, regexArray);
    }

    folders.forEach(folder => {
      retVal.push(...sortByFolderStructure(itemsPerFolder[folder], regexArray, index + 1));
    });
  }

  return retVal;
};

const sortImportsWithConfiguration = ({
  nodes,
  getLevelAndSourceForNode,
  fullOrder = [],
  segmentOrder = [],
}) => {
  const items = nodes.map(node => {
    const { level, source } = getLevelAndSourceForNode(node);
    const segments = source.split('/');

    return {
      node,
      level,
      source,
      segments,
    };
  });

  const itemsPerLevel = groupBy(items, item => item.level);
  const levels = Object.keys(itemsPerLevel)
    .map(key => Number(key))
    .sort((a, b) => a - b);

  const sortedNodes = [];

  levels.forEach(level => {
    const itemsForLevel = itemsPerLevel[`${level}`];
    sortedNodes.push(
      sortByFolderStructure(
        sortByRegexArray(itemsForLevel, fullOrder, item => item.source),
        segmentOrder,
      ).map(item => item.node),
    );
  });

  return sortedNodes;
};

// ======================
// === categorization ===
// ======================

const isAbsoluteImport = (importString, srcRoots) =>
  !![
    ...srcRoots.map(srcRoot => path.resolve(srcRoot, importString)),
    ...srcRoots.map(srcRoot => `${path.resolve(srcRoot, importString)}.js`),
    ...srcRoots.map(srcRoot => path.resolve(srcRoot, importString, 'index.js')),
  ].find(file => fs.existsSync(file) && fs.statSync(file).isFile());

const getCategory = (node, { srcRoots }) => {
  const source = node.source.value;

  if (source.startsWith('../')) {
    return 'relativeUp';
  } else if (source.startsWith('./')) {
    return 'relativeDown';
  } else if (isAbsoluteImport(source, srcRoots)) {
    return 'absolute';
  }
  return 'module';
};

// =================================
// === module + absolute imports ===
// =================================

const sortModuleAndAbsoluteImports = (nodes, groups = []) => {
  const fullOrder = flatten(groups);
  const getLevelAndSourceForNode = node => {
    const source = node.source.value;
    let level = findIndex(groups, group => !!group.find(regex => regex.test(source)));
    if (level === -1) {
      level = Number.MAX_SAFE_INTEGER;
    }
    return { level, source };
  };

  return sortImportsWithConfiguration({
    nodes,
    getLevelAndSourceForNode,
    fullOrder,
  });
};

// ==========================
// === relative imports ↑ ===
// ==========================

const getRelativeUpImportLevelAndSourceForNode = node => {
  const allSegments = node.source.value.split('/');
  const firstDownSegmentIndex = allSegments.findIndex(part => part !== '..');

  let level;
  let downSegments;
  if (firstDownSegmentIndex === -1) {
    level = allSegments.length * -1;
    downSegments = [];
  } else {
    level = firstDownSegmentIndex * -1;
    downSegments = allSegments.slice(firstDownSegmentIndex);
  }

  return {
    level,
    source: downSegments.join('/'),
  };
};

const sortRelativeUpImports = (nodes, segmentOrder) =>
  sortImportsWithConfiguration({
    nodes,
    getLevelAndSourceForNode: getRelativeUpImportLevelAndSourceForNode,
    segmentOrder,
  });

// ==========================
// === relative imports ↓ ===
// ==========================

const sortRelativeDownImports = (nodes, segmentOrder) =>
  sortImportsWithConfiguration({
    nodes,
    getLevelAndSourceForNode: node => ({
      level: 0,
      source: node.source.value.substr('./'.length),
    }),
    segmentOrder,
  });

// ===================
// === aggregation ===
// ===================

const sortImports = (nodes, options) => {
  const nodesPerCategory = groupBy(nodes, node => getCategory(node, options));

  const moduleNodes = nodesPerCategory.module || [];
  const sortedModuleNodes = sortModuleAndAbsoluteImports(moduleNodes, options.moduleImports);

  const absoluteNodes = nodesPerCategory.absolute || [];
  const sortedAbsoluteNodes = sortModuleAndAbsoluteImports(absoluteNodes, options.absoluteImports);

  const relativeUpNodes = nodesPerCategory.relativeUp || [];
  const sortedRelativeUpNodes = sortRelativeUpImports(relativeUpNodes, options.relativeImports);

  const relativeDownNodes = nodesPerCategory.relativeDown || [];
  const sortedRelativeDownNodes = sortRelativeDownImports(
    relativeDownNodes,
    options.relativeImports,
  );

  return {
    sortedModuleNodes,
    sortedAbsoluteNodes,
    sortedRelativeUpNodes,
    sortedRelativeDownNodes,
  };
};

// ============
// === rule ===
// ============

module.exports = {
  meta: {
    docs: {
      description: 'Enforce specific order of ES6 imports',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          srcRoots: {
            type: 'array',
            items: { type: 'string' },
            additionalItems: false,
          },
          moduleImports: {
            type: 'array',
            items: {
              type: 'array',
              // items: { type: 'RegExp' }, - doesn't work in rule runner
              additionalItems: false,
            },
            additionalItems: false,
          },
          absoluteImports: {
            type: 'array',
            items: {
              type: 'array',
              // items: { type: 'RegExp' }, - doesn't work in rule runner
              additionalItems: false,
            },
            additionalItems: false,
          },
          relativeImports: {
            type: 'array',
            // items: { type: 'RegExp' }, - doesn't work in rule runner
            additionalItems: false,
          },
          enforceAlphabeticalOrder: { type: 'boolean' },
          enforceFormatting: { type: 'boolean' },
          simpleFormattingCount: { type: 'number' },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      invalidImportOrder: 'Invalid import order',
    },
  },
  create(context) {
    const defaults = {
      srcRoots: [],
      moduleImports: {},
      absoluteImports: {},
      relativeImportsUp: {},
      relativeImportsDown: {},
      enforceAlphabeticalOrder: true,
      enforceFormatting: true,
      simpleFormattingCount: 0,
    };
    const options = Object.assign({}, defaults, context.options[0] || {});

    const sourceCode = context.getSourceCode();
    const importNodes = [];

    const getValidCommentsBefore = importNode =>
      sourceCode
        .getCommentsBefore(importNode)
        .filter(
          comment =>
            comment.value.trim().startsWith('$FlowFixMe') ||
            comment.value.trim().startsWith('eslint-disable-next-line'),
        );

    const getImportBlock = (groups, groupSeperator = '\n') =>
      groups
        .map(group =>
          group
            .map(node =>
              [
                ...getValidCommentsBefore(node).map(comment => sourceCode.getText(comment)),
                sourceCode.getText(node),
              ].join(`\n`),
            )
            .join('\n'),
        )
        .join(groupSeperator);

    return {
      ImportDeclaration: node => {
        importNodes.push(node);
      },
      'Program:exit': () => {
        if (importNodes.length === 0) {
          return;
        }

        const originalRange = [
          (getValidCommentsBefore(importNodes[0])[0] || importNodes[0]).range[0],
          importNodes[importNodes.length - 1].range[1],
        ];

        const preSortedImportNodes = options.enforceAlphabeticalOrder
          ? sortBy(importNodes, node => node.source.value)
          : importNodes;

        const {
          sortedModuleNodes,
          sortedAbsoluteNodes,
          sortedRelativeUpNodes,
          sortedRelativeDownNodes,
        } = sortImports(preSortedImportNodes, options);

        const sortedNodes = [].concat(
          flatten(sortedModuleNodes),
          flatten(sortedAbsoluteNodes),
          flatten(sortedRelativeUpNodes),
          flatten(sortedRelativeDownNodes),
        );

        const groupSeperator = sortedNodes.length > options.simpleFormattingCount ? '\n\n' : '\n';

        const getNewText = () =>
          [
            getImportBlock(sortedModuleNodes, groupSeperator),
            getImportBlock(sortedAbsoluteNodes, groupSeperator),
            getImportBlock(sortedRelativeUpNodes),
            getImportBlock(sortedRelativeDownNodes),
          ]
            .filter(item => !!item)
            .join(groupSeperator);

        if (options.enforceFormatting) {
          const originalText = sourceCode
            .getText()
            .substr(originalRange[0], originalRange[1] - originalRange[0]);

          const newText = getNewText();

          if (originalText !== newText) {
            context.report({
              messageId: 'invalidImportOrder',
              node: importNodes[0],
              fix(fixer) {
                return fixer.replaceTextRange(originalRange, newText);
              },
            });
          }
        } else {
          const inequalIndex = findIndex(sortedNodes, (node, index) => node !== importNodes[index]);

          if (inequalIndex !== -1) {
            context.report({
              messageId: 'invalidImportOrder',
              node: importNodes[inequalIndex],
              fix(fixer) {
                return fixer.replaceTextRange(originalRange, getNewText());
              },
            });
          }
        }
      },
    };
  },
};
