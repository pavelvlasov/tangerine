# Structure and naming convention

Every package should have exactly the same structure. Similar to most of the packages everywhere,
"production" code (i.e. the actual source code of the functionality this package implements) lives
in its own folder. At the root there should be only "helper" files and folder: those that define the
structure, set up rules that are applicable for the whole package, or provide all necessary
information about said package.

A typical package should have following structure (M - mandatory, O - optional).

-   package.json (M) - just a normal package.json
-   manifest.json (O) - contains information about who owns this particular package. Could be
    replaced by just package.json in the future.
-   .tangerinerc.js (O) - enables a set of tooling and rules for the package (including, but not
    limited to, eslint and stricter rules)
-   src (M) - contains all the source code for this package, including unit tests. See more on how
    to structure code of you package in ["App structure" guide.](../../react/app-structure)
-   README.md (M) - lightweight docs for this package
-   examples (O) - contains integration examples for this package. Those examples should be
    considered "public API" for this packages. They will be rendered in the "docs" area on the
    website, and could be used for integration tests with Cypress
-   docs (O) - detailed docs for the package, that render integration examples and props API
-   integration-tests (O) - integration tests for this package, usually written with Cypress
