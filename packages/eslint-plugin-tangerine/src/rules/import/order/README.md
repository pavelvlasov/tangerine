# Enforce specific order of ES6 imports (import/order)

Provides a useful, flexible and fully autofixable tool for sorting your ES6 imports.

---

🔧 _The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix all of the problems reported by this rule._

---

## Rule Details

Forces imports to be sorted in the following order: modules, absolute imports, relative imports up, relative imports down.

👎 Examples of **incorrect** code for this rule:

```js
/*eslint @atlassian/tangerine/import/order: "error"*/

import SomethingElse from '../../../another/name';
import Anything from './go/down/deep/component';
import Something from 'my-favourite-library';
import AnotherThing from 'some/local/absolute/path';
```

👍 Examples of **correct** code for this rule:

```js
/*eslint @atlassian/tangerine/import/order: "error"*/

import Something from 'my-favourite-library';
import AnotherThing from 'some/local/absolute/path';
import SomethingElse from '../../../another/name';
import Anything from './go/down/deep/component';
```

## Options

The rule takes a configuration object of the following shape:

```js
{
    srcRoots: string[],
    moduleImports: Regex[][],
    absoluteImports: Regex[][],
    relativeImports: Regex[]
    enforceAlphabeticalOrder: boolean,  // default: true
    enforceFormatting: boolean,         // default: true
    simpleFormattingCount: number,      // default:  0
}
```

### `srcRoots`

Array of sources in the project

🛠 Example of the configuration

```js
/*eslint @atlassian/tangerine/import/order: ["error", { srcRoots: ["src", "utils", "tests"] }]*/
```

### `moduleImports`

Order in which module imports are going to be sorted. Accepts arrays of subgroups with Regex patterns

🛠 Example of the configuration

```js
/*eslint @atlassian/tangerine/import/order: ["error", { moduleImports: [
    // react related modules
    [
        /^react$/,
        /^prop-types$/,
        /^react/,
        /^styled-components$/,
    ]
    // tests modules
    [
        /^sinon$/,
        /^enzyme$/,
        /^@mocha/,

        // catch all, otherwise would fall into a separate group
        /./,
    ]
]}]*/
```

👎 Examples of **incorrect** code for this rule:

```js
import { stub } from 'sinon';
import { shallow } from 'enzyme';
import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import styled from 'styled-components';
```

👍 Examples of **correct** code for this rule:

```js
import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import styled from 'styled-components';

import { stub } from 'sinon';
import { shallow } from 'enzyme';
```

### `absoluteImports`

Order in which absolute imports are going to be sorted. Accepts arrays of subgroups with Regex patterns

🛠 Example of the configuration

```js
/*eslint @atlassian/tangerine/import/order: ["error", { absoluteImports: [
    // utils
    [
        /^common\//,
        /^utils\//
    ],
    [
        /^components\//,
        /^pages\//
    ],
]}]*/
```

👎 Examples of **incorrect** code for this rule:

```js
import Page from 'pages/some/path';
import Something from 'common/some/path';
import Util from 'utils/some/path';
import Component from 'components/some/path';
import React from 'react';
```

👍 Examples of **correct** code for this rule:

```js
import React from 'react';

import Something from 'common/some/path';
import Util from 'utils/some/path';

import Component from 'components/some/path';
import Page from 'pages/some/path';
```

### `relativeImports`

Order in which relative imports are going to be sorted. Accepts arrays of Regex patterns.
Imports should be grouped together by the relative level before following the patterns.
Relative imports that going 'up' should be separated from the relative imports that are going 'down' the tree.
'Upwards' imports should always be before 'downwards'.

🛠 Example of the configuration

```js
/*eslint @atlassian/tangerine/import/order: ["error", { relativeImports: [
    /^common\//,
    /^view\//,
]}]*/
```

👎 Examples of **incorrect** code for this rule:

```js
import { F } from './common/a/b';
import { C } from '../common/a/b';
import { D } from '../view/a/b';
import { B } from '../../view/a/b';
import { A } from '../../common/a/b';
```

👍 Examples of **correct** code for this rule:

```js
import React from 'react';

import { A } from '../../common/a/b';
import { B } from '../../view/a/b';
import { C } from '../common/a/b';
import { D } from '../view/a/b';
import { E } from '../something/a/b';

import { F } from './common/a/b';
import { G } from './view/a/b';
import { H } from './something/a/b';
```

### `enforceAlphabeticalOrder`

Forces imports to be in alphabetical order (after applying all the patterns from **moduleImports**, **absoluteImports** and **relativeImports** options

🛠 Example of the configuration

```js
/*eslint @atlassian/tangerine/import/order: ["error", { enforceAlphabeticalOrder: true }]*/
```

👎 Examples of **incorrect** code for this rule:

```js
import A from 'z-library';
import B from 'y-library';
import C from 'b';
import D from 'a/b';
import E from 'a/a';
import F from '../../b';
import G from '../../a';
import H from '../d';
import I from './y';
import J from './x';
```

👍 Examples of **correct** code for this rule:

```js
import A from 'y-library';
import B from 'z-library';
import C from 'b';
import D from 'a/a';
import E from 'a/b';
import F from '../../a';
import G from '../../b';
import H from '../d';
import I from './x';
import J from './y';
```

### `enforceFormatting`

Forces groups of imports to be separated by an empty line

🛠 Example of the configuration

```js
/*eslint @atlassian/tangerine/import/order: ["error", { enforceFormatting: true }]*/
```

👎 Examples of **incorrect** code for this rule:

```js
import A from 'z-library';
import B from 'y-library';
import C from 'b';
import D from 'a/b';
import E from 'a/a';
import F from '../../b';
import G from '../../a';
import H from '../d';
import I from './y';
import J from './x';
```

👍 Examples of **correct** code for this rule:

```js
import A from 'y-library';
import B from 'z-library';

import C from 'b';

import F from '../../a';
import G from '../../b';
import H from '../d';

import I from './x';
import J from './y';
```

### `simpleFormattingCount`

Number of imports after which the formatting is enforced

🛠 Example of the configuration

```js
/*eslint @atlassian/tangerine/import/order: ["error", { simpleFormattingCount: 5 }]*/
```

👎 Examples of **incorrect** code for this rule:

```js
import A from 'y-library';
import B from 'z-library';
import C from 'b';
import F from '../../a';
import G from '../../b';
import H from '../d';
import I from './x';
import J from './y';
```

👍 Examples of **correct** code for this rule:

```js
import A from 'y-library';
import F from '../../a';
import G from '../../b';
import J from './y';
```

```js
import A from 'y-library';
import B from 'z-library';

import C from 'b';

import F from '../../a';
import G from '../../b';
import H from '../d';

import I from './x';
import J from './y';
```

## Autofix

Autofix swallows all comments in imports except for the "//eslint-disable-next-line" comment

## Resources

- [Rule source](./index.js)
- [Rule test](./test.js)
