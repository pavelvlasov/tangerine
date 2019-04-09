The issue of "common" folder is one of the most controversial ones. Left unattended, this folder
have a tendency to quickly become an unstructured dumping ground for everything.

It should be preferred to extract functionality that usually is put into common into a package which
follows all the rules for structuring packages. Common folder exists only as a last resort for the
code that is global across an app and does not make sense to extract this into its own package. The
most common use case here is semi-global types (like for example IssueKey), global constants or mock
data that is used in multiple places (something like issueStatus).

# Naming convention

-   constants/constants.js - folder/file that contains constants that need to be shared between
    different parts of the app. Local constants should stay with their component.
-   types/types.js - folder/file that contains types that need to be shared between different parts
    of the app. Local types should stay with their component.
-   utils/utils.js - folder/file that contains utils that need to be shared between different parts
    of the app. Local utils should stay with their component. If just a file is not enough, then
    every util should be put into its own file with the name that reflects name of that util, and
    has unit tests in a separate file with the name name-of-the-util.test.js.
-   utils.test.js - tests for utils in a file.
-   assets - images and other static resources that need to be shared across the entire package.
-   ui - collection of small UI components that are re-used on different levels of hierarchy in a
    package. Should follow exactly the
    [same rules as UI components](../../code-structure/ui-layer/structure.md) , with one exception:
    main.js can be optional, since the shareable component can be just a styled component. In that
    case the component can contain styled.js, index.js and examples.js only. If there is a need for
    a very complicated component there it should be extracted as its own package.
-   mocks - mock data that is used in different places of a package
