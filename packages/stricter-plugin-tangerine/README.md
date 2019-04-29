# stricter-plugin-tangerine

A set of [Stricter](https://github.com/stricter/stricter) rules developed by [Atlassian](https://www.atlassian.com/) as part of [Tangerine 🍊](https://github.com/atlassian/tangerine).

## Installation

Install [Stricter](https://www.github.com/stricter/stricter) locally or globally:

```sh
$ yarn add --dev stricter
```

If you've installed `Stricter` globally, you'll have to install the Tangerine plugin globally too. Otherwise, install it locally:

```sh
$ yarn add --dev stricter-plugin-tangerine
```

## Configuration

**Note: This will change in the future to a proper plugin system**

Specify the rules dir of this plugin in the `rulesDir` configuration of your `stricter.config.js` file:

```json
{
  "rulesDir": ["my-custom-rules", "node_modules/stricter-plugin-tangerine/rules"]
}
```

You can now enable the rules you want to use:

```json
{
  "rules": {
    "tangerine/project-structure": "error"
  }
}
```

## Rules

- Enforce a specific file structure for your project ([project-structure](./src/rules/project-structure/README.md))

## Contributing

All rules are located in separate directories, in the corresponding `rules/<ruleCategory>` directory. The rule's name must be identical to its directory name.

Every rule must contain:

- `index.js` - The rule's implementation, following [this template](./templates/rules/index.js).
- `README.md` - The rule's documentation, following [this template](./templates/rules/README.md).
- `test.js` - The rule's tests, following [this template](./templates/rules/test.js).

After adding a new rule, run `node generate-readme.js` to add a link to the frontpage `README.md` file.

All rules are exposed automatically.

To change this file, edit [template](./templates/README.md) instead, then run `node generate-readme.js`
