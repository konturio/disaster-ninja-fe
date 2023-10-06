import { createMapAtom, createPrimitiveAtom } from '~utils/atoms/createPrimitives';
import { store } from '~core/store/store';
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

class ToolbarImpl implements Toolbar {
  private toolbarControlsSettingsAtom = createMapAtom<
    ControlID,
    ToolbarControlSettings
  >();
  private toolbarControlsStatesAtom = new Map<ControlID, PrimitiveAtom<ControlState>>();

  toolbarSettings = {
    sections: [],
  };

  setupControl<Ctx extends Record<string, unknown>>(
    settings: ToolbarControlSettings,
  ): ControlController<Ctx> {
    const onInitCbs = new Set<(ctx: Ctx) => OnRemoveCb | void>();
    const onStateChangeCbs = new Set<(ctx: Ctx, state: ControlState) => void>();
    const onRemoveCbs = new Set<(ctx: Ctx) => void>();

    this.toolbarControlsSettingsAtom.set(settings.id, settings);

    const controlStateAtom = createPrimitiveAtom<ControlState>(
      'regular',
      null,
      `[core]controlState.${settings.id}`,
    );
    this.toolbarControlsStatesAtom.set(settings.id, controlStateAtom);

    const controlContext: Ctx = {} as Ctx;
    const cleanUpTasks = new Set<() => void>();

    const unsubscribe = controlStateAtom.subscribe((state) =>
      onStateChangeCbs.forEach((cb) => cb(controlContext, state)),
    );

    store.dispatch(this.toolbarControlsSettingsAtom.set(settings.id, settings));

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

  get controls() {
    return this.toolbarControlsSettingsAtom as unknown as PrimitiveAtom<
      Map<string, ToolbarControlSettings>
    >;
  }

  getControlState(id: ControlID) {
    return this.toolbarControlsStatesAtom.get(id);
  }
}

export const toolbar = new ToolbarImpl();
