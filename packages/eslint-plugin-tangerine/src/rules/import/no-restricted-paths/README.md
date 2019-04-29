# Restrict imports from specific paths (import/no-restricted-paths)

Restrict imports between different parts of your app based on path matching.

---

## Rule Details

This rule allows you to restrict imports between different parts of your app for cases where you want them to be isolated.

To restrict the imports of packages or modules globally, use [import/no-restricted-import](import/no-restricted-import) instead.

This rule completely relies on configuration, it does not have any default configuration and won't do anything out of the box.

## Options

The rule takes a configuration object of the following shape:

```js
{
    basePath?: string,
    restrictions: Array<{
        target: string|string[],
        from: string|string[],
    }>,
    srcRoot?: string,
    message?: string,
}
```

Notes

- all configuration keys are connected with AND logic; if you want OR, use multiple option objects

### `restrictions`

```js
Array<{
    from: string|string[],
    target: string|string[],
}>
```

An array of entries specifying where (`target`) you cannot import certain paths (`from`).

#### `from`

A string or array of strings representing the path(s) that you cannot import from.

#### `target`

A string or array of strings representing which path(s) this import restriction applies to.

### `basePath`

Set the base path for relative `from` and `target` paths to resolve against.

If not specified, defaults to the current working directory `process.cwd()`.

### `srcRoot`

Set the path that any project src relative import paths should be resolved against.

Useful when your project allows importing files relative to the project src root rather than just the current file.

Defaults to `basePath`, only explicitly set this if your project root is different to `basePath`.

### `message`

Custom error message. You can use this to print some more details instead of the generic "Invalid import".

## Examples

👎 Examples of **incorrect** code for this rule:

```js
// filename: ~/shire/src/elves/legolas.js
/* eslint tangerine/import/no-restricted-paths: [
 *     "error",
 *     {
 *         basePath: "~/shire/src",
 *         restrictions: [
 *             { from: "mordor", target: "elves" }
 *         ]
 *     }
 *  ]
 */

import everyone from "../mordor";
```

```js
// filename: ~/shire/src/middle-earth/elves/legolas.js
/* eslint tangerine/import/no-restricted-paths: [
 *     "error",
 *     {
 *         basePath: "~/shire/src/middle-earth",
 *         srcRoot: "~/shire/src",
 *         restrictions: [
 *             { from: "mordor", target: "elves" }
 *         ]
 *     }
 *  ]
 */

import everyone from "middle-earth/mordor";
import everyone from "../mordor";
```

👍 Examples of **correct** code for this rule:

```js
// filename: ~/shire/src/middle-earth/elves/legolas.js
/* eslint tangerine/import/no-restricted-paths: [
 *     "error",
 *     {
 *         basePath: "~/shire/src/middle-earth",
 *         restrictions: [
 *             { from: "mordor", target: "elves" }
 *         ]
 *     }
 *  ]
 */
import everyone from "../rivendell";
```

```js
// filename: ~/shire/src/middle-earth/men/aragorn.js
/* eslint tangerine/import/no-restricted-paths: [
 *     "error",
 *     {
 *         basePath: "~/shire/src/middle-earth",
 *         restrictions: [
 *             { from: "mordor", target: "elves" }
 *         ]
 *     }
 *  ]
 */

import everyone from "../mordor";
```

## When Not To Use It

When you want to allow any folder/file to import from any other folder/file in your app

## Resources

- [Rule source](./index.js)
- [Rule test](./test.js)
- [MDN documentation on import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)
