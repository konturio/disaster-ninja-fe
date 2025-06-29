## Zoom buttons

This feature adds simple zoom in and zoom out buttons to the Toolbar.

### How to use

```ts
import('~features/zoom_buttons').then(({ initZoomButtons }) => {
  initZoomButtons();
});
```

### How it works

Two toolbar controls are created: `ZoomIn` and `ZoomOut`. When
activated they update the current map position atom with the new zoom
level which triggers a map jump.
