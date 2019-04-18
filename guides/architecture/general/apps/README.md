# App

Maps directly to the [organisms](http://bradfrost.com/blog/post/atomic-web-design/#organisms)
concept of atomic design

Any app is a composition of components
([atoms](http://bradfrost.com/blog/post/atomic-web-design/#atoms) and
[molecules](http://bradfrost.com/blog/post/atomic-web-design/#molecules))


## App src structure

As mentioned in [packages structure](../../../monorepo/packages-structure/README.md), the src folder
should contain all the source code of a package. In a simple case of a small package with just one
component inside, it can contain only a few files that follow guidelines for structuring components
(of any type). If a package is more complicated than a simple component, it should follow this
structure:

- [ui](ui-layer/README.md) - all components that are considered “UI” components,
  i.e. anything that renders something on a screen. This is the main part of any app, most of
  logic will go here, including composition of different components,
  [services](../services-layer/structure.md) and
  [state controllers](controllers-layer/structure.md). Should follow all the
  guidelines for structuring UI folder.
- [services](services-layer/README.md) - services and other data providers that
  are specific to this app. Components here implement what is usually called "remote state".
  Should follow all the guidelines for structuring services folder and writing data providers.
- [controllers](controllers-layer/README.md) - components that are responsible
  for shared state management concerns and other stateful logic. Should follow all the guidelines
  for structuring controllers folder and writing state controllers.
- [common](common-layer/README.md) - components (and other things) that are
  global to a package. Should follow all the guidelines for structuring common folder and writing
  common functionality.
- index.js - re-exports what is considered part of the core public API of a package
- main.js - in the absence of ui folder contains main logic of the package. If ui folder exists,
  main logic will go there, and this file will contain only composition of providers that should
  exist at the very root of an app.
- feature-flags.js - feature flags of this package exposed as functions
- async.js - async version if needed

## Rules

### [import/no-restricted-paths](/packages/eslint-plugin-tangerine/rules/import/no-restricted-paths)

The below configuration restricts importing from certain directories as per the app guidelines:

- Inside `/services`, you cannot import from `/controllers` or `/ui`
- Inside `/controllers`, you cannot import from `/services` or `/ui`
- Inside `/common`, you cannot import from `/services`, `/controllers`, or `/ui`

#### Config

```js
'tangerine/import/no-restricted-paths': [
  'error',
  {
    basePath: path.join(appRoot, 'src'),
    srcRoot: 'src',
    restrictions: [
      {
        target: 'services',
        from: ['controllers', 'ui'],
      },
      {
        target: 'controllers',
        from: ['services', 'ui'],
      },
      {
        target: 'common',
        from: ['services', 'controllers', 'ui'],
      },
    ],
    message:
      '\nSee https://github.com/atlassian/tangerine/tree/master/guides/code/app/apps/structure for more details.',
  },
],
```
