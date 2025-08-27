# Search feature

This feature provides a search bar to find locations or MCDA analysis suggestions.
Selected locations become the focused area on the map.
While hovering over location results the geometry is highlighted on the map with a black outline.

## Main parts
- `SearchBar` - UI component with dropdown results.
- `searchLocationAtoms.ts` - handles locations fetching and selection.
- `searchAtoms.ts` - aggregates MCDA and location results.
- `atoms/highlightedGeometry.ts` - stores geometry highlighted on hover.
- `initSearchHighlightLayer` - registers temporary map layer for hovered geometries.
