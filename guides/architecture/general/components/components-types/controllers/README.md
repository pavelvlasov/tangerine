# State controllers

Every time there is a need to share some state or stateful logic between different parts of the
application it should be extracted into a component that we call a "controller".

-   [Local state and stateful logic](./stateful-logic.md)
-   [Shared state](./shared-state.md)

**Important**: major purpose of the controller is to share state or stateful logic only, not to sync the
state with remote data. For that purpose we have a concept of a "service"

## Naming conventions

In order to maintain consistency with Services (since the difference between those two is
conceptual, not in implementation), controllers should follow the same naming convention:

-   they should have Controllers as a suffix
-   they should expose their API through render props in the form of an object with necessary
    meta-information about the controller, stateful data and API to manipulate this data (when
    applicable)
-   When a controller is implemented with React Context API then it should export Provider/Consumer
    pair with the names that end with `ControllerConsumer` and `ControllerProvider` respectively

The only difference compare to services (other than suffixes) is that there are no mandatory fields
for Controllers
