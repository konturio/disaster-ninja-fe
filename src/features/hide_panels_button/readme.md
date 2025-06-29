## Hide panels button

This feature adds a toolbar control that hides the sidebar and all panels except the toolbar.

### How to use

```ts
import('~features/hide_panels_button').then(({ initHidePanelsControl }) => {
  initHidePanelsControl();
});
```

### How it works

When the control becomes active it toggles the `panels-hidden` class on the `body` element. A CSS rule hides elements with class `knt-panel` (except the toolbar) and the sidebar when this class is present.
