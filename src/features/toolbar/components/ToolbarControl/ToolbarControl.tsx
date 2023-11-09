import { Button } from '@konturio/ui-kit';
import { useCallback } from 'react';
import * as icons from '@konturio/default-icons';
import clsx from 'clsx';
import { useAtom } from '@reatom/react';
import { passRefToSettings, resolveValue } from '~core/toolbar/utils';
import s from '../ToolbarContent/ToolbarContent.module.css';
import type {
  ControlID,
  ToolbarControlSettings,
  ToolbarControlStateAtom,
} from '~core/toolbar/types';

export function ToolbarControl({
  id,
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

  switch (settings.type) {
    case 'button':
      const Icon = icons[resolveValue(settings.typeSettings.icon, state)];
      return (
        <Button
          key={id}
          ref={refChangeCallback}
          variant="invert-outline"
          iconBefore={<Icon width={16} height={16} />}
          size={settings.typeSettings.preferredSize}
          className={clsx(s[`control-${settings.typeSettings.preferredSize}`])}
          disabled={state === 'disabled'}
          onClick={toggleState}
        >
          {resolveValue(settings.typeSettings.name, state)}
        </Button>
      );

    case 'widget':
      return (
        <settings.typeSettings.component
          key={id}
          controlClassName=""
          onClick={toggleState}
          state={state}
        />
      );
  }
}
