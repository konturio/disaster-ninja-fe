import { createMapAtom, createPrimitiveAtom } from '~utils/atoms/createPrimitives';
import { store } from '~core/store/store';
import { i18n } from '~core/localization';
import { MCDA_CONTROL_ID, UPLOAD_MCDA_CONTROL_ID } from '~features/mcda/constants';
import { SENSOR_CONTROL_ID } from '~features/live_sensor/constants';
import { SAVE_AS_REFERENCE_AREA_CONTROL_ID } from '~features/reference_area/constants';
import { FOCUSED_GEOMETRY_EDITOR_CONTROL_ID } from '~widgets/FocusedGeometryEditor/constants';
import { BOUNDARY_SELECTOR_CONTROL_ID } from '~features/boundary_selector/constants';
import type {
  ControlID,
  ControlState,
  Toolbar,
  ToolbarControlSettings,
  OnRemoveCb,
  ControlController,
} from './types';
import type { PrimitiveAtom } from '@reatom/core-v2/primitives';

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
        controls: [
          'LocateMe',
          'MapRuler',
          'EditInOsm',
          'BivariateMatrix',
          SENSOR_CONTROL_ID,
          MCDA_CONTROL_ID,
          UPLOAD_MCDA_CONTROL_ID,
          'EditableLayer',
        ],
      },
      {
        name: i18n.t('toolbar.selected_area_label'),
        controls: [
          BOUNDARY_SELECTOR_CONTROL_ID,
          'UploadFile',
          FOCUSED_GEOMETRY_EDITOR_CONTROL_ID,
          SAVE_AS_REFERENCE_AREA_CONTROL_ID,
        ],
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

  // Sets up a control with its settings and state management logic
  setupControl<Ctx extends Record<string, unknown>>(
    settings: ToolbarControlSettings,
  ): ControlController<Ctx> {
    const onInitCbs = new Set<(ctx: Ctx) => OnRemoveCb | void>();
    const onStateChangeCbs = new Set<
      (ctx: Ctx, state: ControlState, prevState: ControlState) => void
    >();
    const onRemoveCbs = new Set<(ctx: Ctx) => void>();
    let initialised = false;

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
      if (state === 'active' && settings.borrowMapInteractions)
        this.disableBorrowMapControls(settings.id);

      if (prevState === 'active' && state !== 'active' && settings.borrowMapInteractions)
        this.enableBorrowMapControls(settings.id);

      onStateChangeCbs.forEach((cb) => cb(controlContext, state, prevState));
      prevState = state;
    });

    // Dispatching the initial state of the control
    store.dispatch(this.toolbarControlsSettingsAtom.set(settings.id, settings));

    // Returning the control controller interface
    return {
      setState: (newState) => controlStateAtom.set(newState),
      stateStream: controlStateAtom,
      init: () => {
        /* React call in twice in Strict mode */
        if (initialised) {
          console.debug('[Toolbar]: Control already initialised, ignoring second call');
          return;
        }
        initialised = true;

        onInitCbs.forEach((cb) => {
          const cleanUpTask = cb(controlContext);
          if (cleanUpTask) cleanUpTasks.add(cleanUpTask);
        });
      },
      remove: async () => {
        /* React call in twice in Strict mode */
        if (!initialised) {
          console.debug('[Toolbar]: Control already removed, ignoring second call');
          return;
        }
        initialised = false;

        unsubscribe();
        onRemoveCbs.forEach((cb) => cb(controlContext));
        cleanUpTasks.forEach((cb) => cb());
        store.dispatch(this.toolbarControlsSettingsAtom.delete(settings.id));
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
