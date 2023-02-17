## Tooltip Service

This service allows us to show tooltips in different places of our application.
Underhood it uses `@konturio/ui-kit` tooltip component for show tooltip in theme style

Tooltip:

- Shows by hover-in and hides by hover-out events (after delay)
- Not interactive
- Can contain only text

## How to use

We assume that all cases of using a tooltip can be reduced to two cases

### We have an element around which a tooltip should be shown

In that case you need import special components and use them

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

let currentTooltipId: number | null = null;

map.on('click', (event) => {
  const bbox = [
    [e.point.x - 5, e.point.y - 5],
    [e.point.x + 5, e.point.y + 5],
  ];

  const selectedFeatures = map.queryRenderedFeatures(bbox, {
    layers: ['counties'],
  });

  // Close previous tooltip
  if (currentTooltipId !== null) {
    tooltips.closeTooltip(currentTooltipId);
    currentTooltipId = null;
  }

  // Show new tooltip
  currentTooltipId = tooltips.showTooltip(
    // Where show
    { x: event.point.x, y: event.point.y },
    // What show
    selectedFeatures.map((f) => f.properties.countryName).join(' ,'),
  );
});
```

### How service works

```ts
interface TooltipService {
  init(mountPoint: Element) => void;
  showTooltip: ({ x: number, y: number }, content: string) => number);
  updateTooltip: ({ x: number, y: number }, content: string) => number);
  closeTooltip: (tooltipId: number) => void;
}

export const tooltips = new TooltipService();
```
