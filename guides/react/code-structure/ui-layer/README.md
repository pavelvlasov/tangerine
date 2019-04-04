# UI layer

The primary goal of UI components is to render an interface. This is where all the composition is
happening: a UI component consumes other UI components, services and state controllers.

All components should be considered “black box” by other components, they can only interact with
each other explicitly via their external API and explicit exports. By doing that, we are optimising
for future refactoring and scalability, and encouraging separation of concerns. In the ideal
scenario, any component on any level of the hierarchy can be moved to any level above by a simple
drag-and-drop, including being extracted into its own package.

While in the past we were adhering to the concept of resentational/container components, in the new
tangerine world it has become obsolete.

Because:

-   when everything is a component and local state management is handled directly in components, the
    line between what is “resentational” and what is “container” is now very hard to define

-   it interferes with the code readability and the flow of data, which is against patterns we are
    going for, where everything is composable

-------
Continue reading:

[UI naming conventions](../../app-structure/ui-layer) |
[UI structure](./structure.md) |
[Writing examples](./examples.md)
