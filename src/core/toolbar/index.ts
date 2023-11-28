import { createMapAtom, createPrimitiveAtom } from '~utils/atoms/createPrimitives';
import { store } from '~core/store/store';
import { i18n } from '~core/localization';
import type {
  ControlID,
  ControlState,
  Toolbar,
  ToolbarControlSettings,
  OnRemoveCb,
  ControlController,
} from './types';
import type { PrimitiveAtom } from '@reatom/core/primitives';

/**
 * ToolbarImpl class manages the toolbar's controls in the application.
 * It handles the addition, removal, and state management of toolbar controls.
 *
 * The toolbar has a configurable layout defined in `toolbarSettings`,
 * which determines the placement and grouping of controls.
 *
 * Controls are added to the toolbar using the `setupControl` method.
 * This method registers the control and its settings in the `toolbarControlsSettingsAtom`.
 *
 * The toolbar's view component listens to changes in `toolbarControlsSettingsAtom` to dynamically
 * update its rendering to accommodate new or removed controls.
 *
 * Controls are rendered in the toolbar if:
 * a) They are setup by a feature using their id.
 * b) Their id is present in the toolbar settings.
 */
class ToolbarImpl implements Toolbar {
  // Atoms for storing the settings and states of the toolbar controls
  private toolbarControlsSettingsAtom = createMapAtom<
    ControlID,
    ToolbarControlSettings
  >();
  private toolbarControlsStatesAtom = new Map<ControlID, PrimitiveAtom<ControlState>>();

  // Configuration for the toolbar sections and their respective controls
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

  // Updates the state of controls that share map interactions
  updateControlsState(
    updateState: (stateAtom: PrimitiveAtom<ControlState>) => void,
    filter?: (controlId: ControlID, settings: ToolbarControlSettings) => boolean,
  ) {
    this.toolbarControlsSettingsAtom.getState().forEach((settings, controlId) => {
      const stateAtom = this.toolbarControlsStatesAtom.get(controlId);
      if (stateAtom && filter?.(controlId, settings)) {
        updateState(stateAtom);
      }
    });
  }

  // Disables controls that borrow map interactions when a control becomes active
  disableBorrowMapControls(activeControlId: ControlID) {
    this.updateControlsState(
      (stateAtom) => {
        if (stateAtom.getState() === 'regular') store.dispatch(stateAtom.set('disabled'));
      },
      (controlId, settings) =>
        controlId !== activeControlId && Boolean(settings.borrowMapInteractions),
    );
  }

  // Enables controls that borrow map interactions when an active control returns to regular state
  enableBorrowMapControls(activeControlId: ControlID) {
    this.updateControlsState(
      (stateAtom) => {
        if (stateAtom.getState() === 'disabled') store.dispatch(stateAtom.set('regular'));
      },
      (controlId, settings) =>
        controlId !== activeControlId && Boolean(settings.borrowMapInteractions),
    );
  }

  resetOtherActiveControls(activeControlId: ControlID) {
    this.updateControlsState(
      (stateAtom) => {
        if (stateAtom.getState() === 'active') store.dispatch(stateAtom.set('regular'));
      },
      (controlId, settings) =>
        controlId !== activeControlId && settings.id !== 'FreehandGeometry',
    );
  }

  // Sets up a control with its settings and state management logic
  setupControl<Ctx extends Record<string, unknown>>(
    settings: ToolbarControlSettings,
  ): ControlController<Ctx> {
    const onInitCbs = new Set<(ctx: Ctx) => OnRemoveCb | void>();
    const onStateChangeCbs = new Set<(ctx: Ctx, state: ControlState) => void>();
    const onRemoveCbs = new Set<(ctx: Ctx) => void>();

    this.toolbarControlsSettingsAtom.set(settings.id, settings);

    // Creating an atom to manage control state
    const controlStateAtom = createPrimitiveAtom<ControlState>(
      'regular',
      null,
      `[core]controlState.${settings.id}`,
    );
    this.toolbarControlsStatesAtom.set(settings.id, controlStateAtom);

    // Context for the control
    const controlContext: Ctx = {} as Ctx;
    const cleanUpTasks = new Set<() => void>();

    let prevState = controlStateAtom.getState();

    // Subscribing to state changes to manage enabling/disabling of controls
    const unsubscribe = controlStateAtom.subscribe((state) => {
      // Order of execution is important here, resetOtherActiveControls should be called before disableBorrowMapControls
      if (state === 'active') this.resetOtherActiveControls(settings.id);

      if (state === 'active' && settings.borrowMapInteractions)
        this.disableBorrowMapControls(settings.id);

      if (prevState === 'active' && state !== 'active' && settings.borrowMapInteractions)
        this.enableBorrowMapControls(settings.id);

      prevState = state;
      onStateChangeCbs.forEach((cb) => cb(controlContext, state));
    });

    // Dispatching the initial state of the control
    store.dispatch(this.toolbarControlsSettingsAtom.set(settings.id, settings));

    // Returning the control controller interface
    return {
      setState: (newState) => controlStateAtom.set(newState),
      stateStream: controlStateAtom,
      init: () => {
        onInitCbs.forEach((cb) => {
          const cleanUpTask = cb(controlContext);
          if (cleanUpTask) cleanUpTasks.add(cleanUpTask);
        });
      },
      remove: async () => {
        unsubscribe();
        onRemoveCbs.forEach((cb) => cb(controlContext));
        cleanUpTasks.forEach((cb) => cb());
        store.dispatch(this.toolbarControlsSettingsAtom.delete(settings.id));
        this.toolbarControlsSettingsAtom.delete(settings.id);
      },
      onInit: (cb) => {
        onInitCbs.add(cb);
        return () => onInitCbs.delete(cb);
      },
      onStateChange: (cb) => {
        onStateChangeCbs.add(cb);
        return () => onStateChangeCbs.delete(cb);
      },
      onRemove: (cb) => {
        onRemoveCbs.add(cb);
        return () => onRemoveCbs.delete(cb);
      },
    };
  }

  // Getter for accessing the controls' settings
  get controls() {
    return this.toolbarControlsSettingsAtom as unknown as PrimitiveAtom<
      Map<string, ToolbarControlSettings>
    >;
  }

  // Getter for accessing a specific control's state
  getControlState(id: ControlID) {
    return this.toolbarControlsStatesAtom.get(id);
  }
}

export const toolbar = new ToolbarImpl();
