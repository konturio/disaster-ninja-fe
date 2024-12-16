## Sidebar

This feature displays collapsible sidebar with logos and button links to available routes

### Feature flag

side_bar (AppFeature.SIDE_BAR)

### How to use

Import `SideBar` component from '~features/side_bar'

required properties:

    currentRouteAtom: CurrentRouteAtom;
    availableRoutesAtom: AvailableRoutesAtom;
    getAbsoluteRoute: (path: string) => string;

### How it works

It renders `AppNameAndIcon` on top

It maps over `availableRoutes` and renders relevant `Link` elements for visible routes and subroutes.

It has collapse button, and collapsed state persisted via localStorage.

It renders `Logo` below
