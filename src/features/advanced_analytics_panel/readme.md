## Advanced Analytics Panel

This feature provides advanced analytics component used for Analytics panel in full state

### Feature flag

advanced_analytics_panel (AppFeature.ADVANCED_ANALYTICS_PANEL)

### How to use

This feature implements [PanelFeatureInterface](/src/types/featuresTypes.ts) and provides content for panel (JSX.Element) that can be rendered inside compatible container

### How it works

It requests data from `/advanced_polygon_details` api for geometry from `focusedGeometryAtom` or whole world.
It renders table with filterable analytical data.
