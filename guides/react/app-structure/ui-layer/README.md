# Naming convention

All UI components should be structured in exactly the same way

-   **index.js** - re-exports what is considered public API for this component
-   **main.js** - this file contains the main logic of the component. It will compose different
    components, including various services/controllers, react context consumers and all other UI
    elements. Concerns that are not relevant for the actual component logic (like styles or
    translations, see the list below) should be extracted into their relevant files.
-   messages.js - all translations for this component should be grouped here and exported as a
    default export.
-   styled.js - all styled components that are used in production code live there. It should not
    contain components that are used for test purposes.
-   types.js - all types for this component live here. The only exception are Props and State, that
    could live in the main.js if they are small enough.
-   constants.js - if a component requires to define a lot of constants they should be extracted
    into this file. There is no need to extract all constants right away though, use your best
    judgement here.
-   test.js - unit tests for the component or its utils. It is recommended to write unit tests for
    all components that have logic worth testing. It is unnecessary to write unit tests for
    components that only render other component with no logic inside, since we also have types and
    examples to help with code coverage. Important: this file should contain actual unit tests, not
    shallow snapshots of the component with the description "component should render".
-   assets - images and other static resources required by this component.
-   examples.js - render examples of usage of this component. See more details in
    [Examples for UI components](../../code-structure/ui-layer/examples.md).
-   utils.js - utils that are specific for this particular component.
-   utils - when a component needs to do a lot of transformations or other operations, a single
    "utils.js" is not enough. When this happens they can be put in a folder instead and separated
    into files. In this case, every util should be put into its own file with the name that reflects
    name of that util, and has unit tests in a separate file with the name name-of-the-util.test.js.

---

Related reading

[UI components structure](../../code-structure/ui-layer/structure.md) |
[Examples for UI components](../../code-structure/ui-layer/examples.md)
