## Tooltip Service

This service allows us to show tooltips in different places of our application.
Underhood it uses `@konturio/ui-kit` tooltip component for show tooltips

Tooltip:

- Shows by hover-in and hides by hover-out events (after delay)
- Not interactive
- Can contain only text\markdown

## How to use

We assume that all cases of using a tooltip can be reduced to two cases

### We have an element around which a tooltip should be shown

In that case you need to import special components and use them

```jsx
import { Tooltip, TooltipTrigger, TooltipContent } from '~core/tooltip';

function Sidebar() {
  return (
    <nav>
      <Tooltip>
        {/* Where to show */}
        <TooltipTrigger>
          <button>Some button with tip</button>
        </TooltipTrigger>
        {/* What to show */}
        <TooltipContent>Text hint</TooltipContent>
      </Tooltip>
    </nav>
  );
}
```

### We have some coordinates on the screen where tooltip should be shown

In that case you need to use imperative api.

For example, let's show countries under cursor

```ts
import { tooltips } from '~core/tooltips';
import type { TooltipId } from '~core/tooltips';

const tooltip = tooltips.createTooltip({
  size: 'bigger',
});

map.on('click', (event) => {
  const bbox = [
    [e.point.x - 5, e.point.y - 5],
    [e.point.x + 5, e.point.y + 5],
  ];

  const selectedFeatures = map.queryRenderedFeatures(bbox, {
    layers: ['counties'],
  });

  // Close previous tooltip
  if (tooltip.isOpen) {
    tooltip.close();
  }

  // Show new tooltip
  currentTooltipId = tooltip.show(
    // Where to show
    { x: event.point.x, y: event.point.y },
    // What to show
    selectedFeatures.map((f) => f.properties.countryName).join(' ,'),
  );
});
```

### Types

```ts
interface Position {
  x: number;
  y: number;
}

interface Tooltip {
  show: (position: Position | Element, content: string) => void;
  close: () => void;
  isOpen: boolean;
}

// <TooltipContent /> props should have type PropsWithChildren<TooltipSettings>

interface TooltipSettings {
  size?: 'default' | 'bigger';
}

interface TooltipService {
  createTooltip: (settings?: TooltipSettings) => Tooltip;
}
```
