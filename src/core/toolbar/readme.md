# Toolbar System

A reactive control management system for the disaster-ninja application using Reatom state management.

## Table of Contents

- [1. Overview](#1-overview)
- [2. Quick Start](#2-quick-start)
- [3. API Reference](#3-api-reference)
  - [3.1. Toolbar API](#31-toolbar-api)
  - [3.2. Control API](#32-control-api)
  - [3.3. Control Settings](#33-control-settings)
- [4. Guides](#4-guides)
  - [4.1. Creating a Simple Control](#41-creating-a-simple-control)
  - [4.2. Creating a Map Tool Control](#42-creating-a-map-tool-control)
  - [4.3. Using Typed Context](#43-using-typed-context)
  - [4.4. Adding to Toolbar Layout](#44-adding-to-toolbar-layout)
- [5. Examples](#5-examples)
  - [5.1. Location Finder](#51-location-finder)
  - [5.2. Drawing Tool](#52-drawing-tool)
  - [5.3. Custom Widget](#53-custom-widget)
- [6. Troubleshooting](#6-troubleshooting)
- [7. Reference](#7-reference)

---

## 1. Overview

The toolbar system provides:

- **Control Registration**: Centralized management of toolbar controls
- **State Management**: Reactive state updates using Reatom atoms
- **Conflict Resolution**: Automatic handling of map interaction conflicts
- **Lifecycle Management**: Init, state changes, and cleanup hooks

**Key Concepts:**

- Controls must be both [registered](#31-toolbar-api) and [added to layout](#44-adding-to-toolbar-layout)
- [Map interaction conflicts](#7-reference) are handled automatically
- [State changes](#32-control-api) drive control behavior

---

## 2. Quick Start

```typescript
import { toolbar } from '~core/toolbar';
import { i18n } from '~core/localization';

// 1. Setup control
export const myControl = toolbar.setupControl({
  id: 'MY_CONTROL_ID',
  type: 'button',
  borrowMapInteractions: true, // Set to true if control needs exclusive map access
  typeSettings: {
    name: 'My Control',
    hint: i18n.t('my_control.hint'),
    icon: 'MyIcon24',
    preferredSize: 'large',
  },
});

// 2. Add control logic
myControl.onInit(() => {
  // Initialize control
});

myControl.onStateChange((ctx, state, prevState) => {
  if (state === 'active') {
    // Control activated
  } else if (prevState === 'active') {
    // Control deactivated
  }
});

// 3. Initialize in your feature module
export function initMyFeature() {
  myControl.init();
}
```

### Adding Control to Toolbar Layout

Add your control ID to `toolbarSettings.sections` in `src/core/toolbar/index.ts`:

```typescript
toolbarSettings = {
  sections: [
    {
      name: i18n.t('toolbar.tools_label'),
      controls: [
        'LocateMe',
        'MY_CONTROL_ID', // Add here
        // ... other controls
      ],
    },
  ],
};
```

## API Reference

### 3.1. Toolbar API

The main `toolbar` object for managing controls.

#### `toolbar.setupControl<Ctx>(settings): ControlController<Ctx>`

Creates and registers a new toolbar control.

**Parameters:**

- `settings: ToolbarControlSettings` - Control configuration ([see Control Settings](#33-control-settings))
- `Ctx` - TypeScript type for control-specific data shared between callbacks ([see Using Typed Context](#43-using-typed-context))

**Returns:** `ControlController<Ctx>` - Control instance ([see Control API](#32-control-api))

#### `toolbar.getControlState(id): PrimitiveAtom<ControlState> | undefined`

Gets the state atom for a specific control.

**Parameters:**

- `id: ControlID` - The control identifier

**Returns:** State atom or undefined if control not found

#### `toolbar.controls: PrimitiveAtom<Map<ControlID, ToolbarControlSettings>>`

Reactive map of all registered control settings. Used by UI components.

#### `toolbar.toolbarSettings: ToolbarSettings`

Configuration object defining toolbar layout and sections.

---

### 3.2. Control API

The control instance returned by `setupControl()`.

#### 3.2.1. Lifecycle Methods

**`init(): void`**

Initializes the control and executes all registered `onInit` callbacks. Must be called once after control setup.

```typescript
myControl.init(); // Call in your feature module
```

**`remove(): void`**

Removes the control from toolbar, unsubscribes from state changes, executes cleanup callbacks, and removes from UI.

```typescript
myControl.remove(); // Call when unmounting feature
```

**`setState(state: ControlState): Action<ControlState>`**

Changes the control's state and returns a Reatom action.

```typescript
myControl.setState('active'); // Activate control
myControl.setState('regular'); // Return to normal
myControl.setState('disabled'); // Disable (usually automatic)
```

**Parameters:**

- `state: ControlState` - New state: `'regular'` | `'active'` | `'disabled'`

**Returns:** Reatom action for state change

#### 3.2.2. Event Handlers

**`onInit(callback: (ctx: Ctx) => OnRemoveCb | void): () => void`**

Registers callback that runs when control initializes. Use for setup logic.

```typescript
myControl.onInit((ctx) => {
  // Setup resources
  ctx.mapHandler = setupMapHandler();

  // Optional: return cleanup function
  return () => {
    cleanupResources();
  };
});
```

**Parameters:**

- `callback: (ctx: Ctx) => OnRemoveCb | void` - Initialization callback

**Returns:** Unsubscribe function

**`onStateChange(callback: (ctx: Ctx, state: ControlState, prevState: ControlState) => void): () => void`**

Registers callback that runs on every state change. Main behavior implementation.

```typescript
myControl.onStateChange((ctx, state, prevState) => {
  if (state === 'active') {
    // Control activated - start your feature
    startFeature();
  } else if (prevState === 'active') {
    // Control deactivated - stop your feature
    stopFeature();
  }
});
```

**Parameters:**

- `callback: (ctx, state, prevState) => void` - State change callback
  - `ctx: Ctx` - Control context object
  - `state: ControlState` - New state
  - `prevState: ControlState` - Previous state

**Returns:** Unsubscribe function

**`onRemove(callback: (ctx: Ctx) => void): () => void`**

Registers callback that runs when control is removed. Use for final cleanup.

```typescript
myControl.onRemove((ctx) => {
  // Final cleanup when feature unmounts
  removeEventHandlers();
  cleanupResources();
});
```

**Parameters:**

- `callback: (ctx: Ctx) => void` - Removal callback

**Returns:** Unsubscribe function

#### 3.2.3. State Subscription

**`stateStream: StateStream<ControlState>`**

Reactive stream for direct state subscriptions outside standard callbacks.

```typescript
const unsubscribe = myControl.stateStream.subscribe((state) => {
  console.log('Control state:', state);
});

// Later: unsubscribe();
```

**Interface:**

```typescript
interface StateStream<T> {
  subscribe(callback: (state: T) => void): () => void;
}
```

#### 3.2.4. Control States

| State        | Description                 | When Set                                      |
| ------------ | --------------------------- | --------------------------------------------- |
| `'regular'`  | Normal state (default)      | Initial state, after deactivation             |
| `'active'`   | Control is currently active | When user activates control                   |
| `'disabled'` | Control is disabled         | Automatic when other borrowing control active |

### 3.3. Control Settings

#### 3.3.1. Button Control

```typescript
{
  id: string;                                    // Unique identifier
  type: 'button';
  borrowMapInteractions?: boolean;               // Default: false
  typeSettings: {
    name: string | ValueForState<string>;       // Button text
    hint: string | ValueForState<string>;       // Tooltip text
    icon: string | ValueForState<string>;       // Icon name
    preferredSize: 'small' | 'medium' | 'large'; // Button size
    mobilePreferredSize?: 'small' | 'medium' | 'large'; // Mobile override
    onRef?: (el: HTMLElement) => void;          // Element ref callback
  };
}
```

#### 3.3.2. Widget Control

```typescript
{
  id: string;
  type: 'widget';
  borrowMapInteractions?: boolean;
  typeSettings: {
    component: (props: WidgetProps) => JSX.Element | null;
  };
}
```

#### 3.3.3. State-Dependent Values

Use `ValueForState<T>` for values that change based on control state:

```typescript
name: {
  regular: 'Start Drawing',
  active: 'Stop Drawing',
  disabled: 'Drawing Disabled',
}
```

## Guides

### 4.1. Creating a Simple Control

**Step 1:** Setup the control

```typescript
export const locateControl = toolbar.setupControl({
  id: 'LocateMe',
  type: 'button',
  typeSettings: {
    name: 'Locate Me',
    icon: 'Location24',
    preferredSize: 'medium',
  },
});
```

**Step 2:** Add behavior

```typescript
locateControl.onStateChange((ctx, state) => {
  if (state === 'active') {
    navigator.geolocation.getCurrentPosition(/* ... */);
    locateControl.setState('regular');
  }
});
```

**Step 3:** Initialize

```typescript
locateControl.init();
```

**Step 4:** [Add to toolbar layout](#44-adding-to-toolbar-layout)

### 4.2. Creating a Map Tool Control

For controls that need exclusive map access:

**Step 1:** Setup with map interactions

```typescript
export const drawControl = toolbar.setupControl({
  id: 'DrawTool',
  type: 'button',
  borrowMapInteractions: true, // Enables conflict resolution
  typeSettings: {
    name: { regular: 'Start Drawing', active: 'Stop Drawing' },
    icon: { regular: 'Draw24', active: 'Stop24' },
    preferredSize: 'large',
  },
});
```

**Step 2:** Handle map interactions

```typescript
drawControl.onStateChange((ctx, state, prevState) => {
  if (state === 'active') {
    // Enable drawing
    map.getCanvas().style.cursor = 'crosshair';
    enableDrawingHandlers();
  } else if (prevState === 'active') {
    // Disable drawing
    map.getCanvas().style.cursor = '';
    disableDrawingHandlers();
  }
});
```

**See also:** [Map Interaction Conflicts](#7-reference)

### 4.3. Using Typed Context

For sharing data between control callbacks:

**Step 1:** Define context type

```typescript
interface MyControlContext {
  mapHandler?: () => void;
  cleanup?: () => void;
}

export const myControl = toolbar.setupControl<MyControlContext>({
  id: 'MY_CONTROL',
  // ... settings
});
```

**Step 2:** Use context across callbacks

```typescript
myControl.onInit((ctx) => {
  ctx.mapHandler = () => {
    /* handle map click */
  };
  ctx.cleanup = () => {
    /* cleanup resources */
  };
});

myControl.onStateChange((ctx, state) => {
  if (state === 'active' && ctx.mapHandler) {
    map.on('click', ctx.mapHandler);
  }
});

myControl.onRemove((ctx) => {
  ctx.cleanup?.();
});
```

### 4.4. Adding to Toolbar Layout

Controls must be registered in `toolbarSettings` to be visible.

Edit `src/core/toolbar/index.ts`:

```typescript
toolbarSettings = {
  sections: [
    {
      name: i18n.t('toolbar.tools_label'),
      controls: [
        'LocateMe',
        'MY_CONTROL_ID', // Add your control here
        // ... other controls
      ],
    },
    {
      name: i18n.t('toolbar.selected_area_label'),
      controls: [
        // ... area controls
      ],
    },
  ],
};
```

**Important:** Controls not listed here won't appear in the toolbar.

## Examples

### 5.1. Location Finder

Simple control that gets user location:

```typescript
export const locationControl = toolbar.setupControl({
  id: 'LocationFinder',
  type: 'button',
  typeSettings: {
    name: 'Find Location',
    hint: 'Get current position',
    icon: 'Location24',
    preferredSize: 'medium',
  },
});

locationControl.onStateChange((ctx, state) => {
  if (state === 'active') {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        map.flyTo({
          center: [position.coords.longitude, position.coords.latitude],
          zoom: 15,
        });
        locationControl.setState('regular');
      },
      (error) => {
        console.error('Location error:', error);
        locationControl.setState('regular');
      },
    );
  }
});
```

### 5.2. Drawing Tool

Control with map interactions and context:

```typescript
export const polygonTool = toolbar.setupControl<{
  draw?: MapboxDraw;
}>({
  id: 'PolygonTool',
  type: 'button',
  borrowMapInteractions: true,
  typeSettings: {
    name: {
      regular: 'Draw Polygon',
      active: 'Finish Drawing',
    },
    icon: {
      regular: 'Polygon24',
      active: 'Check24',
    },
    preferredSize: 'large',
  },
});

polygonTool.onInit((ctx) => {
  ctx.draw = new MapboxDraw({
    displayControlsDefault: false,
    defaultMode: 'draw_polygon',
  });
  map.addControl(ctx.draw);
});

polygonTool.onStateChange((ctx, state, prevState) => {
  if (state === 'active') {
    ctx.draw?.changeMode('draw_polygon');
  } else if (prevState === 'active') {
    const features = ctx.draw?.getAll();
    if (features?.features.length) {
      onPolygonCreated(features.features[0]);
    }
    ctx.draw?.deleteAll();
  }
});
```

### 5.3. Custom Widget

Advanced control with custom rendering:

```typescript
const AnalysisWidget = ({ controlComponent: Button, state, onClick }: WidgetProps) => (
  <div>
    <Button
      icon={<AnalysisIcon />}
      onClick={onClick}
      active={state === 'active'}
      size="large"
    >
      Analysis
    </Button>
    {state === 'active' && (
      <div className="analysis-panel">
        <p>Analysis options...</p>
      </div>
    )}
  </div>
);

export const analysisWidget = toolbar.setupControl({
  id: 'AnalysisWidget',
  type: 'widget',
  typeSettings: {
    component: AnalysisWidget,
  },
});
```

## Troubleshooting

| Problem             | Cause                 | Solution                                                                     |
| ------------------- | --------------------- | ---------------------------------------------------------------------------- |
| Control not visible | Not in toolbar layout | Add to `toolbarSettings.sections` ([guide](#44-adding-to-toolbar-layout))    |
| Control not working | Not initialized       | Call `control.init()` in feature module                                      |
| Map conflicts       | Multiple active tools | Set `borrowMapInteractions: true` ([guide](#42-creating-a-map-tool-control)) |
| State not updating  | Direct state mutation | Use `control.setState()` ([API ref](#32-control-api))                        |
| Memory leaks        | No cleanup            | Return cleanup from `onInit` ([guide](#43-using-typed-context))              |
| TypeScript errors   | Missing types         | Check [Control Settings](#33-control-settings) types                         |

**Still having issues?** Check the [examples](#5-examples) for working implementations.

## Reference

### 7.1. Types

```typescript
type ControlState = 'regular' | 'active' | 'disabled';
type ValueForState<T> = Record<ControlState, T>;
type ControlID = string;
```

### 7.2. Map Interaction Conflicts

When `borrowMapInteractions: true`:

- Only one control can be active at a time
- Other borrowing controls automatically disabled
- System handles enable/disable transitions
- Use for drawing tools, selection tools, etc.

### 7.3. Related Files

| File                 | Purpose                                                |
| -------------------- | ------------------------------------------------------ |
| `types.ts`           | Type definitions                                       |
| `utils.ts`           | Helper functions (`resolveValue`, `passRefToSettings`) |
| `example.tsx`        | Implementation examples                                |
| `~features/toolbar/` | UI rendering components                                |

---

**[↑ Back to Top](#toolbar-system)**
