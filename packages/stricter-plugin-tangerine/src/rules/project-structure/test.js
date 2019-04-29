const { join, sep } = require('path');
const {
  filesMatch,
  dirsMatch,
  matchHierarchy,
  prepareStruct,
  processMismatches,
  performMatch,
  readDir,
  resolveDefinitionAlias,
} = require('.');

jest.mock('fs');

describe('filesMatch', () => {
  test('empty list matches empty struct', () => {
    const result = filesMatch([], {});

    expect(result).toEqual({ isMatch: true });
  });

  test("not empty list doesn't match empty struct", () => {
    const result = filesMatch(['test'], {});

    expect(result).toEqual({ extra: { test: { type: 'file' } }, isMatch: false });
  });

  test("empty list doesn't match not empty struct", () => {
    const result = filesMatch([], { test: { type: 'file' } });

    expect(result).toEqual({ isMatch: false, missing: { test: { type: 'file' } } });
  });

  test('empty list matches optional struct', () => {
    const result = filesMatch([], { test: { type: 'file', optional: true } });

    expect(result).toEqual({ isMatch: true });
  });

  test('a file matches corresponding struct', () => {
    const result = filesMatch(['test'], { test: { type: 'file' } });

    expect(result).toEqual({ isMatch: true });
  });

  test("a file doesn't match a dir", () => {
    const result = filesMatch(['test'], { test: { type: 'dir' } });

    expect(result).toEqual({ extra: { test: { type: 'file' } }, isMatch: false });
  });

  test('files match corresponding struct', () => {
    const result = filesMatch(['test1', 'test2'], {
      test1: { type: 'file' },
      test2: { type: 'file' },
    });

    expect(result).toEqual({ isMatch: true });
  });

  test('files match corresponding struct wiht optional', () => {
    const result = filesMatch(['test1'], {
      test1: { type: 'file' },
      test2: { type: 'file', optional: true },
    });

    expect(result).toEqual({ isMatch: true });
  });

  test("not matching files don't match corresponding struct", () => {
    const result = filesMatch(['test1', 'test2', 'test3'], {
      test1: { type: 'file' },
      test2: { type: 'file' },
    });

    expect(result).toEqual({ extra: { test3: { type: 'file' } }, isMatch: false });
  });

  test("missing files don't match corresponding struct", () => {
    const result = filesMatch(['test1'], { test1: { type: 'file' }, test2: { type: 'file' } });

    expect(result).toEqual({ isMatch: false, missing: { test2: { type: 'file' } } });
  });

  test('files match asterisk', () => {
    const result = filesMatch(['test1', 'test2'], { '*': { type: 'file' } });

    expect(result).toEqual({ isMatch: true });
  });

  test('no files match asterisk', () => {
    const result = filesMatch([], { '*': [{ type: 'file' }] });

    expect(result).toEqual({ isMatch: true });
  });

  test("a file match doesn't match wrong asterisk", () => {
    const result = filesMatch(['file'], { '*': [{ type: 'dir' }] });

    expect(result).toEqual({ extra: { file: { type: 'file' } }, isMatch: false });
  });

  test('not matching files match with asterisk', () => {
    const result = filesMatch(['test1', 'test2', 'test3'], {
      test1: { type: 'file' },
      test2: { type: 'file' },
      '*': { type: 'file' },
    });

    expect(result).toEqual({ isMatch: true });
  });
});

describe('dirsMatch', () => {
  test('empty list matches empty struct', () => {
    const result = dirsMatch('', [], {}, {});

    expect(result).toEqual({ isMatch: true });
  });

  test("not empty list doesn't match empty struct", () => {
    const result = dirsMatch('', ['test'], {}, {});

    expect(result).toEqual({ extra: { test: { type: 'dir' } }, isMatch: false });
  });

  test("empty list doesn't match not empty struct", () => {
    const result = dirsMatch('', [], {}, { test: { type: 'dir' } });

    expect(result).toEqual({ isMatch: false, missing: { test: { type: 'dir' } } });
  });

  test('empty list matches optional struct', () => {
    const result = dirsMatch('', [], {}, { test: { type: 'dir', optional: true } });

    expect(result).toEqual({ isMatch: true });
  });

  test('a dir matches corresponding struct', () => {
    const result = dirsMatch('', ['test'], {}, { test: { type: 'dir' } });

    expect(result).toEqual({ isMatch: true });
  });

  test("a dir doesn't match a file", () => {
    const result = dirsMatch('', ['test'], {}, { test: { type: 'file' } });

    expect(result).toEqual({ extra: { test: { type: 'dir' } }, isMatch: false });
  });

  test('dirs match corresponding struct', () => {
    const result = dirsMatch(
      '',
      ['test1', 'test2'],
      {},
      { test1: { type: 'dir' }, test2: { type: 'dir' } },
    );

    expect(result).toEqual({ isMatch: true });
  });

  test('dirs match corresponding struct wiht optional', () => {
    const result = dirsMatch(
      '',
      ['test1'],
      {},
      { test1: { type: 'dir' }, test2: { type: 'dir', optional: true } },
    );

    expect(result).toEqual({ isMatch: true });
  });

  test("not matching dirs don't match corresponding struct", () => {
    const result = dirsMatch(
      '',
      ['test1', 'test2', 'test3'],
      {},
      { test1: { type: 'dir' }, test2: { type: 'dir' } },
    );

    expect(result).toEqual({ extra: { test3: { type: 'dir' } }, isMatch: false });
  });

  test("missing dirs don't match corresponding struct", () => {
    const result = dirsMatch('', ['test1'], {}, { test1: { type: 'dir' }, test2: { type: 'dir' } });

    expect(result).toEqual({ isMatch: false, missing: { test2: { type: 'dir' } } });
  });

  test('dirs match asterisk', () => {
    const result = dirsMatch('', ['test1', 'test2'], {}, { '*': { type: 'dir' } });

    expect(result).toEqual({ isMatch: true });
  });

  test('no dirs match asterisk', () => {
    const result = dirsMatch('', [], {}, { '*': [{ type: 'dir' }] });

    expect(result).toEqual({ isMatch: true });
  });

  test("a dir match doesn't match wrong asterisk", () => {
    const result = dirsMatch('', ['dir'], {}, { '*': [{ type: 'file' }] });

    expect(result).toEqual({ extra: { dir: { type: 'dir' } }, isMatch: false });
  });

  test('not matching dirs match with asterisk', () => {
    const result = dirsMatch(
      '',
      ['test1', 'test2', 'test3'],
      {},
      { test1: { type: 'dir' }, test2: { type: 'dir' }, '*': { type: 'dir' } },
    );

    expect(result).toEqual({ isMatch: true });
  });
});

describe('matchHierarchy', () => {
  test('can match multiple dir levels', () => {
    const result = matchHierarchy(
      'root',
      {
        root: {
          dirs: ['level1'],
          files: [],
        },
        [join('root', 'level1')]: {
          dirs: ['level2'],
          files: [],
        },
        [join('root', 'level1', 'level2')]: {
          dirs: ['level3'],
          files: [],
        },
      },
      {
        level1: { type: 'level1' },
      },
      { level1: { level2: { type: 'level2' } }, level2: { level3: { type: 'dir' } } },
    );

    expect(result).toEqual({ isMatch: true });
  });

  test('can match multiple dir levels without definitions', () => {
    const result = matchHierarchy(
      'root',
      {
        root: {
          dirs: ['level1'],
          files: [],
        },
        [join('root', 'level1')]: {
          dirs: ['level2'],
          files: [],
        },
        [join('root', 'level1', 'level2')]: {
          dirs: ['level3'],
          files: [],
        },
      },
      {
        level1: { level2: { level3: { type: 'dir' } } },
      },
      {},
    );

    expect(result).toEqual({ isMatch: true });
  });

  test('can match multiple dirs and files', () => {
    const result = matchHierarchy(
      'root',
      {
        root: {
          dirs: ['level1'],
          files: ['file1'],
        },
        [join('root', 'level1')]: {
          dirs: ['level2'],
          files: ['file2'],
        },
      },
      {
        level1: { type: 'level1' },
        file1: { type: 'file' },
      },
      { level1: { level2: { type: 'dir' }, file2: { type: 'file' } } },
    );

    expect(result).toEqual({ isMatch: true });
  });

  test('can handle asterisks', () => {
    const result = matchHierarchy(
      'root',
      {
        root: {
          dirs: ['not_level1'],
          files: ['file1'],
        },
        [join('root', 'not_level1')]: {
          dirs: ['level2'],
          files: [],
        },
      },
      {
        file1: { type: 'file' },
        '*': { type: 'level1' },
      },
      { level1: { level2: { type: 'dir' } } },
    );

    expect(result).toEqual({ isMatch: true });
  });

  test('Produces different mismatches', () => {
    const result = matchHierarchy(
      'root',
      {
        root: {
          dirs: ['test-dir-missing', 'extra-dir'],
          files: ['test-file', 'extra-file'],
        },
        [join('root', 'test-dir-missing')]: {
          dirs: ['test-dir-extra'],
          files: [],
        },
        [join('root', 'test-dir-missing', 'test-dir-extra')]: {
          dirs: [],
          files: [],
        },
      },
      {
        'test-file': { type: 'file' },
        'test-dir-missing': { type: 'app' },
        'missing-file': { type: 'file' },
        'missing-dir': { type: 'dir' },
      },
      {
        app: {
          '*': { type: 'sub-app' },
        },
        'sub-app': {
          'not-existing-file': { type: 'file' },
        },
      },
    );

    expect(result).toMatchSnapshot();
  });

  test('Fail if optional name matches but not the structure', () => {
    const result = matchHierarchy(
      '/root/',
      {
        '/root/': {
          dirs: ['foo'],
          files: [],
        },
        '/root/foo': {
          dirs: [],
          files: ['failure'],
        },
      },
      {
        type: 'package',
        optional: false,
      },
      {
        package: {
          foo: {
            type: 'bar',
            optional: true,
          },
        },
        bar: {
          baz: {
            type: 'file',
            optional: false,
          },
        },
      },
    );

    expect(result).toMatchSnapshot();
  });
});

describe('performMatch', () => {
  test('requires root dir', () => {
    expect(() => {
      performMatch(null, null, {});
    }).toThrow(/is required/);
  });

  test('does not allow asterisks on root level', () => {
    expect(() => {
      performMatch(null, null, {
        '*': { type: 'dir' },
        '.': { type: 'dir' },
      });
    }).toThrow(/is not allowed/);
  });

  test('can handle tangerine', () => {
    const result = performMatch(
      'root',
      {
        root: {
          dirs: ['api', 'ops', 'state', 'view', 'navigation'],
          files: ['index.js', 'main.js'],
        },
        [join('root', 'navigation')]: {
          dirs: ['api', 'common', 'ops', 'state', 'view'],
          files: ['index.js', 'main.js'],
        },
      },
      {
        '.': { type: 'app' },
        app: {
          api: { type: 'dir' },
          common: { type: 'dir', optional: true },
          ops: { type: 'dir' },
          state: { type: 'dir' },
          view: { type: 'dir' },
          'index.js': { type: 'file' },
          'main.js': { type: 'file' },
          '*': { type: 'app' },
        },
      },
    );

    expect(result).toEqual({ isMatch: true });
  });

  test('can identify mismatches', () => {
    const result = performMatch(
      'root',
      {
        root: {
          dirs: ['api', 'ops', 'navigation'],
          files: ['index.js', 'main.js'],
        },
        [join('root', 'navigation')]: {
          dirs: ['api'],
          files: ['index.js'],
        },
      },
      {
        '.': { type: 'app' },
        app: {
          api: { type: 'dir' },
          ops: { type: 'dir' },
          'index.js': { type: 'file' },
          'main.js': { type: 'file' },
          '*': { type: 'app' },
        },
      },
    );

    expect(result).toMatchSnapshot();
  });
});

describe('prepareStruct', () => {
  test('expands type names', () => {
    const result = prepareStruct({
      foo: 'dir',
      bar: 'file',
      baz: {
        bazfoo: 'dir',
        bazbar: 'file',
      },
      prepared: { type: 'prepared-type', optional: true },
      '*': ['dir', 'file'],
    });

    expect(result).toEqual({
      foo: { type: 'dir', optional: false },
      bar: { type: 'file', optional: false },
      baz: {
        bazfoo: { type: 'dir', optional: false },
        bazbar: { type: 'file', optional: false },
      },
      prepared: { type: 'prepared-type', optional: true },
      '*': [{ type: 'dir', optional: false }, { type: 'file', optional: false }],
    });
  });

  test('expands paths', () => {
    const result = prepareStruct({
      [`foo${sep}bar${sep}baz`]: 'dir',
    });

    expect(result).toEqual({
      foo: {
        bar: {
          baz: { type: 'dir', optional: false },
          '*': [{ type: 'dir', optional: false }, { type: 'file', optional: false }],
        },
        '*': [{ type: 'dir', optional: false }, { type: 'file', optional: false }],
      },
      '*': [{ type: 'dir', optional: false }, { type: 'file', optional: false }],
    });
  });

  test('merges expanded paths and does not override asterisks', () => {
    const result = prepareStruct({
      [`foo${sep}bar${sep}baz`]: 'dir',
      [`foo${sep}bar${sep}a`]: 'dir',
      [`foo${sep}b`]: 'dir',
      [`foo`]: 'dir',
      '*': [{ type: 'dir', optional: true }],
    });

    expect(result).toEqual({
      foo: {
        b: { type: 'dir', optional: false },
        bar: {
          a: { type: 'dir', optional: false },
          baz: { type: 'dir', optional: false },
          '*': [{ type: 'dir', optional: false }, { type: 'file', optional: false }],
        },
        '*': [{ type: 'dir', optional: false }, { type: 'file', optional: false }],
      },
      '*': [{ type: 'dir', optional: true }],
    });
  });

  test('fails when duplicates', () => {
    expect(() => {
      prepareStruct({
        foo: 'file',
        [`foo${sep}bar`]: 'dir',
      });
    }).toThrow(/Trying to merge incompatible definitions for foo/);
  });

  test('fails when deep duplicates', () => {
    expect(() => {
      prepareStruct({
        [`foo${sep}bar`]: 'file',
        [`foo${sep}bar${sep}baz`]: 'dir',
      });
    }).toThrow(/Trying to merge incompatible definitions for bar/);
  });
});

describe('processMismatches', () => {
  test('returns empty array for empty mismatch', () => {
    const result = processMismatches({ isMatch: true });

    expect(result).toEqual([]);
  });

  test('returns multiple errors for a complex mismatch', () => {
    const result = processMismatches(
      {
        dirs: {
          extra: {
            'extra-dir': {
              type: 'dir',
            },
          },
          isMatch: false,
          missing: {
            'missing-dir': {
              type: 'dir',
            },
            'test-dir-missing': {
              matches: [
                {
                  dirs: {
                    extra: {
                      'test-dir-extra': {
                        matches: [
                          {
                            files: {
                              isMatch: false,
                              missing: {
                                'not-existing-file': {
                                  type: 'file',
                                },
                              },
                            },
                            isMatch: false,
                          },
                        ],
                        type: 'dir',
                      },
                    },
                    isMatch: false,
                  },
                  isMatch: false,
                },
              ],
              type: 'app',
            },
          },
        },
        files: {
          extra: {
            'extra-file': {
              type: 'file',
            },
          },
          isMatch: false,
          missing: {
            'missing-file': {
              type: 'file',
            },
          },
        },
        isMatch: false,
      },
      'rootDir',
    );

    expect(result).toEqual([
      `Missing file rootDir${sep}missing-file`,
      `Could not match file rootDir${sep}extra-file`,
      `Missing directory rootDir${sep}missing-dir`,
      `Missing file rootDir${sep}test-dir-missing${sep}test-dir-extra${sep}not-existing-file`,
      `Extra directory rootDir${sep}extra-dir`,
    ]);
  });
});

describe('resolveDefinitionAlias', () => {
  test('stops at dir', () => {
    const definitionsByName = {
      app: { type: 'app1' },
      app1: { type: 'app2' },
      app2: { type: 'dir', optional: false },
    };
    const result = resolveDefinitionAlias(definitionsByName.app, definitionsByName);

    expect(result).toEqual(definitionsByName.app2);
  });

  test('stops at object', () => {
    const definitionsByName = {
      app: { type: 'app1' },
      app1: {
        app2: { type: 'dir', optional: false },
      },
    };
    const result = resolveDefinitionAlias(definitionsByName.app, definitionsByName);

    expect(result).toEqual(definitionsByName.app1);
  });

  test('throws an error if no type is found', () => {
    const definitionsByName = {
      app: { type: 'app1' },
    };

    expect(() => resolveDefinitionAlias(definitionsByName.app, definitionsByName)).toThrow(
      /not found/,
    );
  });

  test('throws an error if circular reference', () => {
    const definitionsByName = {
      app: { type: 'app1' },
      app1: { type: 'app' },
    };

    expect(() => resolveDefinitionAlias(definitionsByName.app, definitionsByName)).toThrow(
      /circular/,
    );
  });
});

describe('readDir', () => {
  test('works', () => {
    const { readdirSync, statSync } = require('fs');
    readdirSync.mockImplementation(dir => {
      if (dir === '/foo' || dir === '/bar') {
        return ['file', 'folder'];
      } else if (dir === '/foo/folder' || dir === '/bar/folder') {
        return ['file'];
      }
      return [];
    });
    statSync.mockImplementation(absolutePath => ({
      isDirectory: () =>
        absolutePath === '/foo' ||
        absolutePath === '/foo/folder' ||
        absolutePath === '/bar' ||
        absolutePath === '/bar/folder',
    }));

    const result = readDir(['/foo/file', '/foo/folder/file', '/bar/file', '/bar/folder/file']);
    expect(result).toEqual({
      '/foo': {
        '/foo': {
          dirs: ['folder'],
          files: ['file'],
        },
        '/foo/folder': {
          dirs: [],
          files: ['file'],
        },
      },
      '/bar': {
        '/bar': {
          dirs: ['folder'],
          files: ['file'],
        },
        '/bar/folder': {
          dirs: [],
          files: ['file'],
        },
      },
    });
  });
});
