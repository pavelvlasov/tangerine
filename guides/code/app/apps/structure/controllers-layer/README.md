All components that are responsible for syncing UI with an external data source belong here. They
are considered “leaf” components, to be consumed and composed by UI components only. There should
never be any imports from “UI” within “services”.

# Naming convention

-   **index.js** - re-exports what is considered public API for this component.
-   **main.js** - this file contains the main logic of the component. This files also can contain
    react createContext, there is no need to extract it outside.
-   types.js - all types for this component live here. The only exception are Props and State, that
    could live in the main.js if they are small enough.
-   constants.js - if a component requires to define a lot of constants they should be extracted
    into this file. There is no need to extract all constants right away though, use your best
    judgement here.
-   test.js - unit tests for the component or its utils.
-   mocks.js - mocks of a component with different variations of data to use in tests or examples of
    UI components that consume this service. See more details in the DI section.
-   utils.js - utils that are specific for this particular component.
-   utils - in very rare cases, when a component needs to do a lot of transformations or other
    operations, a single "util.js" is not enough. When this happens they can be put in a folder
    instead and separated into files. In this case, every util should be put into its own file with
    the name that reflects name of that util, and has unit tests in a separate file with the name
    name-of-the-util.test.js.
-   context.js - in very rare cases, when the context is too big, it might make sense to extract it
    into its own file.

---

Related reading

[Controllers components structure](structure.md) |
[State management](../../../../state-management)
