# Enforce consistent naming of react lifecycle method arguments (react/lifecycle-method-arg-naming)

Enforces parameter names of React lifecycle methods to be consistent with official documentation.

---

## Rule Details

Enforces that parameters of React lifecycle methods are given the correct names, as per official documentation.
This is important as some lifecycle methods compare props and state from the past, or the immediate future, and
the parameter name describes which situation we are in (for example 'nextProps', 'prevProps').

Enforcing consistent naming prevents bugs caused by arguments being used incorrectly due to a wrong name, e.g. `prevProps` instead of `nextProps`.

The following lifecycle method arguments are enforced:

- `componentDidUpdate(prevProps, prevState, snapshot)`
- `getSnapshotBeforeUpdate(prevProps, prevState)`
- `shouldComponentUpdate(nextProps, nextState)`

## Options

This rule has no configuration.

## Examples

👎 Examples of **incorrect** code for this rule:

```js
/* eslint tangerine/react/lifecycle-method-arg-naming: "error" */

class MyComp extends Component {
  componentDidUpdate(prevState, prevProps) {}
}
```

```js
/* eslint tangerine/react/lifecycle-method-arg-naming: "error" */

class MyComp extends Component {
  shouldComponentUpdate(p, s) {}
}
```

👍 Examples of **correct** code for this rule:

```js
/* eslint tangerine/react/lifecycle-method-arg-naming: "error" */

class MyComp extends Component {
  componentDidUpdate(prevProps, prevState) {}
}
```

```js
/* eslint tangerine/react/lifecycle-method-arg-naming: "error" */

class MyComp extends Component {
  shouldComponentUpdate(nextProps, nextState) {}
}
```

## When Not To Use It

When you want lifecycle method arguments to be arbitrarily named.

## Resources

- [Rule source](./index.js)
- [Rule test](./test.js)
