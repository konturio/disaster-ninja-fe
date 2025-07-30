# Panel and Layer State Persistence

This module stores UI panel states and enabled map layers in `localStorage` so the application can restore them on the next visit.

## API

- `loadEnabledLayers()` – returns an array of layer IDs saved from the previous session or `null` if nothing is stored.
- `persistEnabledLayers()` – subscribes to `enabledLayersAtom` changes and saves the current layer set.
- `savePanelState(panelId, state)` / `loadPanelState(panelId)` – save and restore a single panel state (`'full' | 'short' | 'closed'`).

The storage keys are namespaced with the current application id from `configRepo`.
