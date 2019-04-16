# eslint-plugin-tangerine

A set of [Eslint](https://github.com/eslint/eslint) rules developed by [Atlassian](https://www.atlassian.com/) as part of [Tangerine 🍊](https://github.com/atlassian/tangerine).

![Tangerine](https://github.com/atlassian/tangerine/raw/master/packages/eslint-plugin-tangerine/resources/tangerine-transparent.png)

## Installation

Install [ESLint](https://www.github.com/eslint/eslint) locally or globally:

```sh
$ yarn add --dev eslint
```

If you've installed `ESLint` globally, you'll have to install the Tangerine plugin globally too. Otherwise, install it locally:

```sh
$ yarn add --dev eslint-plugin-tangerine
```

## Configuration

Specify `tangerine` as a plugin in `.eslintrc.js` file:

```json
{
  "plugins": ["tangerine"]
}
```

You can now enable the rules you want to use:

```json
{
  "rules": {
    "tangerine/import/restricted-paths": "error"
  }
}
```

## Rules

Rules with the wrench icon 🔧 can automatically be fixed by passing the `--fix` option to the [command line](https://eslint.org/docs/user-guide/command-line-interface#fix)

\${rules}

## Contributing

All rules are located in separate directories, in the corresponding `rules/<ruleCategory>` directory. The rule's name must be identical to its directory name.

Every rule must contain:

- `index.js` - The rule's implementation, following [this template](./templates/rules/index.js).
- `README.md` - The rule's documentation, following [this template](./templates/rules/README.md).
- `test.js` - The rule's tests, following [this template](./templates/rules/test.js).

After adding a new rule, run `node generate-readme.js` to add a link to the frontpage `README.md` file.

All rules are exposed automatically.

To change this file, edit [template](./templates/README.md) instead, then run `node generate-readme.js`
