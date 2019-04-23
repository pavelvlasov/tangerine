# Remove leading `./` in relative imports from other folders (import/no-dot-prefix-in-upward-relative-imports)

E.g. code should be `import x from '../fileName'` instead of `import x from './../fileName'`

---

🔧 _The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix problems reported by this rule._

---

## Rule Details

👎 Examples of **incorrect** code for this rule:

```js
/*eslint @atlassian/tangerine/import/no-dot-prefix-in-upward-relative-imports: "error"*/

import something from './../foo';
import something from './../../foo';
```

👍 Examples of **correct** code for this rule:

```js
/*eslint @atlassian/tangerine/import/no-dot-prefix-in-upward-relative-imports: "error"*/

import something from 'foo';
import something from './foo';
import something from '../foo';
import something from '../../foo';
```

## Resources

- [Rule source](./index.js)
- [Rule test](./test.js)
