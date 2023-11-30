import { useCallback } from 'react';
import { useAtom } from '@reatom/react';
import { passRefToSettings, resolveValue } from './utils';
import { toolbar } from './index';
import type { ControlID, ToolbarControlSettings, ToolbarControlStateAtom } from './types';

/* How to get all controls that app want to put into toolbar */
function ExampleToolbar() {
  const [controls] = useAtom(toolbar.controls);
  return (
    <div>
      {Array.from(controls.entries()).map(([id, settings]) => {
        const stateAtom = toolbar.getControlState(id);
        return stateAtom ? (
          <ExampleControl id={id} key={id} settings={settings} stateAtom={stateAtom} />
        ) : null;
      })}
    </div>
  );
}

/* How to render control */
function ExampleControl({
  settings,
  stateAtom,
}: {
  id: ControlID;
  settings: ToolbarControlSettings;
  stateAtom: ToolbarControlStateAtom;
}) {
  /* Implement "onRef" toolbar setting */
  const refChangeCallback = useCallback(
    (el: HTMLElement | null) => passRefToSettings(settings, el),
    [settings],
  );

  /* Subscribe to actual state */
  const [state, actions] = useAtom(stateAtom);

  /* Switch states */
  const toggleState = useCallback(
    () =>
      actions.change((currentState) =>
        currentState === 'active' ? 'regular' : 'active',
      ),
    [actions],
  );

  /* Add implementation for every control type */
  switch (settings.type) {
    // Button example
    case 'button':
      return (
        <button
          ref={refChangeCallback}
          disabled={state === 'disabled'}
          onClick={toggleState}
        >
          {resolveValue(settings.typeSettings.name, state)}
        </button>
      );

    // Widget example
    case 'widget':
      return (
        <settings.typeSettings.component
          controlComponent={() => null}
          onClick={toggleState}
          state={state}
        />
      );
  }
}
