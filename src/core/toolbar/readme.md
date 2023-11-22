# ToolbarImpl Documentation

## Overview

`ToolbarImpl` is a class that manages the toolbar's controls in a web application. This class handles the addition, removal, and state management of toolbar controls. It also provides a configurable layout for the placement and grouping of controls within the toolbar.

## Configuration

The toolbar's layout is defined in `toolbarSettings`, which determines the placement and grouping of controls. This configuration includes sections and the controls contained within each section.

### Example Configuration

```javascript
toolbarSettings = {
  sections: [
    {
      name: i18n.t('toolbar.tools_label'),
      controls: ['LocateMe', 'MapRuler', 'EditInOsm', 'MCDA', 'EditableLayer'],
    },
    {
      name: i18n.t('toolbar.selected_area_label'),
      controls: ['BoundarySelector', 'UploadFile', 'FreehandGeometry'],
    },
  ],
};
```

## Methods

### setupControl

- **Purpose**: Registers a control with its settings and state management logic.
- **Parameters**:
  - `settings`: The settings object for the control being setup.
- **Returns**: An object representing the control controller.

### disableBorrowMapControls

- **Purpose**: Disables controls that borrow map interactions when a control becomes active.
- **Parameters**:
  - `activeControlId`: The ID of the control that has become active.

### enableBorrowMapControls

- **Purpose**: Enables controls that borrow map interactions when an active control returns to the regular state.
- **Parameters**:
  - `activeControlId`: The ID of the control that was previously active.

### getControlState

- **Purpose**: Retrieves the state of a specific control.
- **Parameters**:
  - `id`: The ID of the control.
- **Returns**: The state of the specified control.

## Usage

Controls are added to the toolbar by calling the `setupControl` method. This method requires a settings object that includes the control's ID and other configuration details.

The `disableBorrowMapControls` and `enableBorrowMapControls` methods are used internally to manage the states of controls that interact with the map. These methods are triggered by state changes in individual controls.

Конечно, я могу расширить пример, включив описание всех доступных методов для контрола. Вот обновленный раздел документации с упоминанием всех методов:

### Example Control Usage: `exampleControl`

This section demonstrates the creation and use of a new control named `exampleControl`. It includes steps for setting up the control, defining its behavior, and utilizing available methods.

#### Step 1: Setup Control

First, define the control settings and register the control using `setupControl`.

```javascript
import { toolbar } from '~core/toolbar';
import type { Action } from '@reatom/core';

export const exampleControl =
  toolbar.setupControl <
  {
    // Add specific context types here
  } >
  {
    id: 'EXAMPLE_CONTROL_ID',
    type: 'button',
    borrowMapInteractions: true,
    typeSettings: {
      name: 'Example Control',
      hint: 'Hint for Example Control',
      icon: 'ExampleIcon',
      preferredSize: 'medium',
    },
  };
```

#### Step 2: Define Control Behavior

Set up listeners for initialization and state changes to define the control's behavior.

```javascript
exampleControl.onInit((ctx) => {
  // Add initialization logic here
});

exampleControl.onStateChange((ctx, state) => {
  if (state === 'active') {
    // Logic for when the control is activated
  } else {
    // Logic for when the control is deactivated
  }
});
```

#### Step 3: Initialize the Control

Initialize the control at an appropriate point in your application's lifecycle.

```javascript
export function initExampleControl() {
  exampleControl.init();
}
```

#### Available Methods for `exampleControl`

- `setState(newState)`: Sets the state of the control. `newState` can be 'active', 'disabled', or any other custom state defined in your application.
- `stateStream`: A stream that emits the current state of the control, allowing for reactive programming patterns.
- `init()`: Initializes the control, triggering any logic defined in the `onInit` callback.
- `remove()`: Removes the control from the toolbar and cleans up any resources or subscriptions.
- `onInit(callback)`: Registers a callback to be invoked when the control is initialized.
- `onStateChange(callback)`: Registers a callback to be called whenever the control's state changes.
- `onRemove(callback)`: Registers a callback to be invoked when the control is removed.

## Notes

- Controls are only rendered in the toolbar if they are setup by a feature using their ID and their ID is present in the toolbar settings.
- The class relies on `createMapAtom` and `createPrimitiveAtom` from `@reatom/core/primitives` for state management.
