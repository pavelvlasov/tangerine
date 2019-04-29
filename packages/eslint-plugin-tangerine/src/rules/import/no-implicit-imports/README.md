# Enforce Explicit Imports (import/no-implicit-imports)

There are different ways to import elements. This rule aims to standardize imports.
With explicit imports, it is clear from the imports which elements of React are used in the given file.

---

🔧 _The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix all of the problems reported by this rule._

---

## Rule Details

This rule enforces explicit imports over implicit imports

👎 Examples of **incorrect** code for this rule:

```js
/*eslint @atlassian/tangerine/import/no-implicit-imports: "error"*/
import React from 'react';
...
type Props = {|
    mySubComponent: React.ComponentType<{||}>,
|};
...
class MyComponent extends React.Component {
...
```

👍 Examples of **correct** code for this rule:

```js
/*eslint @atlassian/tangerine/import/no-implicit-imports: "error"*/

import React, { Component, type ComponentType } from 'react';
...
type Props = {|
    mySubComponent: ComponentType<{||}>,
|};
...
class MyComponent extends Component {
...
```

## Options

The rule takes a configuration object of the following shape:

```js
{
    source: string,
    keepDefaultImport: boolean
}[]
```

### `source`

This rule will only apply to imports of the specified sources

🛠 Example of the configuration

```js
/*eslint @atlassian/tangerine/import/no-implicit-imports ["error", {[
    { source: "react" }, 
]}]*/
```

👍 Examples of **correct** code for this rule:

```js
import Foo from 'foo';
import { Component } from 'react';

const x = Foo.Baz;
const y = Component;
```

👎 Examples of **incorrect** code for this rule:

```js
import Foo from 'foo';
import React from 'react';

const x = Foo.Baz;
const y = React.Component;
```

### `keepDefaultImport`

Setting this option to true will not remove the default import when applying the fix (defaults to false).

🛠 Example of the configuration

```js
/*eslint @atlassian/tangerine/import/no-implicit-imports: ["error", {[
    { source: "react", keepDefaultImport: true }, 
    { source: "foo" }
]}]*/
```

Source code

```js
import React from 'react';
const x = React.Component;
```

Fixed output

```js
import React from 'react';
import { Component } from 'react';
const x = Component;
```

## Resources
