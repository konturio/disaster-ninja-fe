## Breadcrumbs

Breadcrumbs display the chain of administrative boundaries for the current map center.

### How to use

This feature is initialized automatically when loaded. It reacts to `currentMapPositionAtom` updates and shows available boundaries.

### How it works

`fetchBreadcrumbsItems` checks if the map center remains inside previously fetched boundaries. If so, it avoids a new API request. When only part of the old boundaries contains the new center, that part stays visible until updated data arrives.
