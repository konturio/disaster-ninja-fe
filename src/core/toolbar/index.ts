import { createMapAtom, createPrimitiveAtom } from '~utils/atoms/createPrimitives';
import { store } from '~core/store/store';
import type {
  SetupControlAction,
  ControlID,
  ControlState,
  Toolbar,
  ToolbarControlSettings,
  ToolbarSettings,
} from './types';

/**
 * Toolbar have config about where every tool can be places
 * Event can have some set of possible configurations
 * (toolbarSettings)
 *
 * Every time when some feature want to add control -
 * it call `addControl` action with control settings.
 * This settings added to `toolbarControlsSettingsAtom`.
 *
 * Toolbar view listening `toolbarControlsSettingsAtom`.
 * When settings updated - toolbar view re-rendering to fit (or remove)
 * new control
 *
 * So, thats mean - control rendered in toolbar if:
 * a) Feature setup control and pass id
 * b) This id present in toolbar settings
 */
const toolbarSettings: ToolbarSettings = {
  sections: [],
};

/* */
const toolbarControlsSettingsAtom = createMapAtom<ControlID, ToolbarControlSettings>();

// Actions

const setupControl: SetupControlAction = (settings) => {
  // @ts-expect-error - works right, but impossible to analyze for typechecker
  toolbarControlsSettingsAtom.set(settings.id, settings);

  const controlStateAtom = createPrimitiveAtom<ControlState>(
    'regular',
    null,
    `[core]controlState.${settings.id}`,
  );
  // @ts-expect-error - works right, but impossible to analyze for typechecker
  let controlContext: ReturnType<typeof settings.onInit> = {};

  const unsubscribe = controlStateAtom.subscribe((state) =>
    settings.onStateChange(state, controlContext),
  );

  store.dispatch(
    // @ts-expect-error - works right, but impossible to analyze for typechecker
    toolbarControlsSettingsAtom.set(settings.id, settings),
  );

  return {
    setState: (newState) => controlStateAtom.set(newState),
    stateStream: controlStateAtom,
    init: () => {
      controlContext = settings.onInit?.();
    },
    dispose: () => {
      unsubscribe();
      settings.onRemove?.(controlContext);
      store.dispatch(toolbarControlsSettingsAtom.delete(settings.id));
    },
  };
};

export const toolbar: Toolbar = {
  setupControl,
  toolbarSettings,
  // toolbarControlsSettingsAtom,
};
