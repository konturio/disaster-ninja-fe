## Toolbar

Groups various map controls into sections and shows them in a floating draggable panel.

### Feature Flag

`AppFeature.TOOLBAR`

### How to use

```ts
import { toolbar, shortToolbar } from '~features/toolbar';
import { FullAndShortStatesPanelWidget } from '~widgets/FullAndShortStatesPanelWidget';

<FullAndShortStatesPanelWidget
  fullState={toolbar()}
  shortState={shortToolbar()}
/>
```

### How it works

`ToolbarContent` collects controls from the toolbar service and arranges them into sections. The toolbar panel is wrapped with `DraggableContainer` so users can move it around the screen. Buttons wrap to new lines, eliminating horizontal scrolling.
