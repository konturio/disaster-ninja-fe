# Description of the `current_event` feature

This feature is responsible for displaying and auto-focusing on the current event on the map.

## Atom descriptions

### `currentEventAutoFocusAtom`

This atom is responsible for auto-focusing on the current event on the map. It subscribes to changes in `currentEventGeometryAtom` (an atom that contains data about the current event with geometry) and when it changes, it starts the auto-focusing process. If the `scheduledAutoFocus` state is `false`.
If the current event geometry has changed, the atom uses `getCameraForGeometry` from the `~utils/map` library to calculate the camera position for the event geometry. If the camera position is valid, the atom sets the `scheduledAutoFocus` state to `false` and sets the current map position to the camera position.

### `currentEventGeometryAtom`

The `currentEventGeometryAtom` holds the information about the current selected event with geometry. It subscribes to changes in the `currentEventResourceAtom`. If `currentEventResourceAtom` has changed, and it is fully loaded and contains data, the `currentEventGeometryAtom` checks the source of the geometry. If the source is not an episode, the `currentEventGeometryAtom` sets the `focusedGeometryAtom` to the geometry value from the `currentEventResourceAtom` object, with a reference to the original event data as `meta`.

If `currentEventResourceAtom` is fully loaded but does not contain data, the atom's value is set to `null` and the `focusedGeometryAtom` is reset to remove the event shape from the map.

After the `currentEventResourceAtom` is fully loaded, the `currentEventGeometryAtom` sends a metric about the result of loading the `CURRENT_EVENT` feature once.

### `currentEventRefresherAtom`

This atom is responsible for refreshing the current event. It subscribes to changes in `currentEventAtom` (an atom that contains data about the current event) and when it changes, adds `currentEventResourceAtom` (an atom that contains data about the current event) to the list of data auto-updating service if the current event is not null. If the current event is null or its ID is null, the atom removes `currentEventResourceAtom` from the list of data auto-updating service.
