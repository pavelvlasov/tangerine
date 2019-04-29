# <Rule's short description> (<your-rule-name>)

_REPLACE ME:_ Provide a short overview of your rule (1 or 2 sentences).

---

## Rule Details

_REPLACE ME:_ Describe your rule in more detail.
Specify what is the default configuration or if configuration is required.
Give examples for valid and invalid code (with the default configuration; examples for specific configuration options should be given in the "Options" section).

👎 Examples of **incorrect** code for this rule:

```js
/*stricter tangerine/<your-rule-path>: "error"*/

var x = ...;
```

👍 Examples of **correct** code for this rule:

```js
/*stricter tangerine/<your-rule-path>: "error"*/

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
/*stricter tangerine/<your-rule-path>: ["error", { foo: "bar" }]*/

var x = ...;
```

👍 Examples of **correct** code for this rule:

```js
/*stricter tangerine/<your-rule-path>: ["error", { foo: "bar" }]*/

var x = ...;
```

### `baz: "this"`

_REPLACE ME:_ Describe the purpose of your option, and provide incorrect/correct examples (for different values if necessary).

👎 Examples of **incorrect** code for this rule:

```js
/*stricter tangerine/<your-rule-path>: ["error", { baz: "this" }]*/

var x = ...;
```

👍 Examples of **correct** code for this rule:

```js
/*stricter tangerine/<your-rule-path>: ["error", { baz: "this" }]*/

var x = ...;
```

## When Not To Use It

_REPLACE ME:_ Optional notes on when not to use it.

## Resources

- [Rule source](./index.js)
- [Rule test](./test.js)
- _REPLACE ME:_ [Any other reference](https://example.org)
