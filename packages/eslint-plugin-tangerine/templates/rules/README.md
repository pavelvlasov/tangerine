# <Rule's short description> (<your-rule-category>/<your-rule-name>)

_REPLACE ME:_ Provide a short overview of your rule (1 or 2 sentences).

_REMOVE ME:_ Delete the block below if the rule is _not_ autofixable and does _not_ have dependencies.

---

_REMOVE ME:_ Delete the following block if your rule is not auto-fixable.

🔧 _The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix problems reported by this rule._

_REMOVE ME:_ Specify hard dependencies and "nice to haves" (e.g. for better autofixing, e.g. prettier).

🤝 _This rule depends on [foo/some-other-rule](https://example.org), and plays nicely with [foo/some-other-rule](https://example.org), [foo/some-other-rule](https://example.org), and [foo/some-other-rule](https://example.org)._

---

## Rule Details

_REPLACE ME:_ Describe your rule in more detail.
Specify what is the default configuration or if configuration is required.
Give examples for valid and invalid code (with the default configuration; examples for specific configuration options should be given in the "Options" section).

👎 Examples of **incorrect** code for this rule:

```js
/*eslint tangerine/<your-rule-path>: "error"*/

var x = ...;
```

👍 Examples of **correct** code for this rule:

```js
/*eslint tangerine/<your-rule-path>: "error"*/

var x = ...;
```

## Options

_REPLACE ME:_ Describe your rules configuration, or remove section altogether.

The rule takes a configuration object of the following shape:

_REPLACE ME:_ Define shape of configuration in Flow syntax.

```js
{
    foo: string, // defaults to "foo"
    bar: number, // defaults to 42
    baz: "this" | "that", // defaults to "this"
}
```

### `foo`

_REPLACE ME:_ Describe the purpose of your option, and provide incorrect/correct examples (for different values of the option, if necessary).

👎 Examples of **incorrect** code for this rule:

```js
/*eslint tangerine/<your-rule-path>: ["error", { foo: "bar" }]*/

var x = ...;
```

👍 Examples of **correct** code for this rule:

```js
/*eslint tangerine/<your-rule-path>: ["error", { foo: "bar" }]*/

var x = ...;
```

### `baz: "this"`

_REPLACE ME:_ Describe the purpose of your option, and provide incorrect/correct examples (for different values if necessary).

👎 Examples of **incorrect** code for this rule:

```js
/*eslint tangerine/<your-rule-path>: ["error", { baz: "this" }]*/

var x = ...;
```

👍 Examples of **correct** code for this rule:

```js
/*eslint tangerine/<your-rule-path>: ["error", { baz: "this" }]*/

var x = ...;
```

## Autofix

_REPLACE ME:_ Optional notes on autofixing behaviour. Elaborate on how this rule depends (hard or soft) on other rules for successful autofixing.

## When Not To Use It

_REPLACE ME:_ Optional notes on when not to use it.

## Resources

- [Rule source](./index.js)
- [Rule test](./test.js)
- _REPLACE ME:_ [Any other reference](https://example.org)
