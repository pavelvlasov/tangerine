# Enforce a specific file structure for your project (project-structure)

Enforce a fine-grained file structure for your project by specifying what it should look like.

---

## Rule Details

This rule gives you fine-grained control over how your project structure should look like by allowing you to
whitelist allowed directories and files up to an arbitrary level of nesting.

This rule requires configuration of your project structure and does not enforce anything without configuration.

## Options

The rule takes a configuration object of the following shape:

```js
{
    definitions: { [name: string]: DirStructureObject | DefName },
    errorTemplate: string,
}
```

### `definitions`

This is where you define your project structure.

The `definitions` config is an object containing directory structure definitions.

A more detailed typing is as follows:

```ts
type ROOT = '.';
type WILDCARD = '*';
type DefName = string;
type FileDef = {
  type: 'file' | 'dir' | DefName;
  optional?: boolean;
};
type DirStructure = {
  [filename: string | WILDCARD]: FileDef | DirStructure | DefName;
};
type Definitions = {
  [ROOT]: DirStructure | DefName;
  [DefName]: DirStructure | DefName;
};
```

The root directory definition is the only mandatory definition and corresponds to the `rootPath` option passed to stricter.

Within the root definition you can define your directory structure, optionally providing additional definitions to help flatten
the configuration.

All files should have a type of `'file'` whereas directories can either have their content structure explicitly enforced or not. To explicitly enforce, either provide an inline `DirStructure` object or reference a `DefName` in the top-level `definitions` configuration. If you do not want to enforce its structure, pass a `FileDef` object instead with type of `'dir'`.

An example configuration is as follows:

```js
definitions: {
  '.': {
    'README.md': { type: 'file' },
    'package.json': { type: 'file' },
    'index.js': { type: 'file', optional: true },
    src: {
      ui: { type: { ... }, optional: true },
      services: { type: { ... }, optional: true },
      controllers: { type: { ... }, optional: true },
      common: { type: { ... }, optional: true },
      'main.js': { type: 'file', optional: true },
      'index.js': { type: 'file' },
    },
    tests: { type: 'dir', optional: true },
    docs: { type: 'dir', optional: true },
  },
}
```

This configuration only contains the mandatory root directory definition, all other directory structure is inlined.

Alternatively, this could have been flattened by writing definitions for sub directories.

```js
definitions: {
  '.': 'package',
  package: {
    'README.md': { type: 'file' },
    'package.json': { type: 'file' },
    'index.js': { type: 'file', optional: true },
    src: { type: 'src' },
    tests: { type: 'dir', optional: true },
    docs: { type: 'dir', optional: true },
  },
  src: {
      ui: { type: 'ui', optional: true },
      services: { type: 'services', optional: true },
      controllers: { type: 'controllers', optional: true },
      common: { type: 'common', optional: true },
      'main.js': { type: 'file', optional: true },
      'index.js': { type: 'file' },
  },
  common: { ... },
  controllers: { ... },
  services: { ... },
  ui: { ... },
}
```

Either approach is valid.

👎 Examples of **incorrect** structure that will violate config:

```js
stricterConfig = {
  rules: {
    tangerine/project-structure: {
      level: "error",
      config: {
        definitions: {
          '.': {
            'README.md': { type: 'file' },
            'package.json': { type: 'file' },
            'index.js': { type: 'file', optional: true },
            src: {
              ui: { type: { ... }, optional: true },
              services: { type: { ... }, optional: true },
              controllers: { type: { ... }, optional: true },
              common: { type: { ... }, optional: true },
              'main.js': { type: 'file', optional: true },
              'index.js': { type: 'file' },
            },
            tests: { type: 'dir', optional: true },
            docs: { type: 'dir', optional: true },
          },
        }
      }
    }
  }
};

📦project
 ┣ 📂docs // ✅ - Contents of docs can be anything
 ┃ ┣ 📜foo.js
 ┃ ┗ 📂bar
 ┣ 📂examples  // ❌ Not specified in root definition
 ┃ ┗ 📜examples.js
 ┣ 📂src
 ┃ ┣ 📂foo  // ❌ Not specified in src definition
 ┃ ┃ ┗ 📜index.js
 ┃ ┣ 📂ui
 ┃ ┃ ┣ 📜index.js
 ┃ ┃ ┣ 📜main.js
 ┃ ┃ ┣ 📜messages.js
 ┃ ┃ ┗ 📜types.js
 ┃ ┗ 📜index.js
 ┣ 📜index.js
 ┗ 📜package.json
 // ❌ README.md is missing in root and is non-optional
```

### `errorTemplate`

Provide a custom error message template. The original message will be inserted into the `'#messages#'` placeholder in your text.

E.g.

```js
{
  errorTemplate: '#messages#\nSee here for more details: ...',
}
```

## When Not To Use It

When you do not want to enforce a particular project structure.

## Resources

- [Rule source](./index.js)
- [Rule test](./test.js)
