# Enforce consistent default import names for specified sources (import/default-import-names)

Forces names for the _default_ imports to be the always the same as specified in the configuration of this rule

---

🔧 _The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix problems reported by this rule._

---

## Rule Details

You need to provide a configuration with accepted names for default import, one rule per imported file path

👎 Examples of **incorrect** code for this rule:

```js
/*eslint @atlassian/tangerine/import/default-import-names: [ 'error', [
                                                              { name: 'React', source: 'react' },
                                                              { name: 'styled', source: 'styled-components' },
                                                          ]],*/

import react from 'react';
import Foo from 'styled-components';
```

👍 Examples of **correct** code for this rule:

```js
/*eslint @atlassian/tangerine/import/default-import-names: [ 'error', [
                                                               { name: 'React', source: 'react'},
                                                               { name: 'styled', source: 'styled-components'},
                                                           ]],*/

import React from 'react';
import styled from 'styled-components';
```

## Options

The rule takes a configuration object of the following shape:

```js
[
  {
    source: string,
    name: string,
  },
];
```

### `source`

Imported file path, to which to apply this rule.

### `name`

The only allowed name for the default import from this file

## Resources

- [Rule source](./index.js)
- [Rule test](./test.js)
