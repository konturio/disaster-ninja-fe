import { useCallback } from 'react';
import { useAtom } from '@reatom/react-v2';
import { passRefToSettings, resolveValue } from '~core/toolbar/utils';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { ToolbarIcon } from '../ToolbarIcon';
import type {
  ControlID,
  ToolbarControlSettings,
  ToolbarControlStateAtom,
} from '~core/toolbar/types';
import type { ControlButttonProps } from '../ToolbarButton/ToolbarButton';

export function ToolbarControl({
  id,
  settings,
  stateAtom,
  controlComponent: ControlComponent,
}: {
  id: ControlID;
  settings: ToolbarControlSettings;
  stateAtom: ToolbarControlStateAtom;
  controlComponent: React.ComponentType<
    ControlButttonProps & React.RefAttributes<HTMLButtonElement>
  >;
}) {
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);

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
      const icon = resolveValue(settings.typeSettings.icon, state);
      const size = isMobile
        ? (settings.typeSettings.mobilePreferredSize ?? 'medium')
        : settings.typeSettings.preferredSize;

      return (
        <ControlComponent
          id={id}
          key={id}
          ref={refChangeCallback}
          icon={<ToolbarIcon icon={icon} width={16} height={16} />}
          size={size}
          active={state === 'active'}
          disabled={state === 'disabled'}
          onClick={toggleState}
        >
          {resolveValue(settings.typeSettings.name, state)}
        </ControlComponent>
      );

    case 'widget':
      return (
        <settings.typeSettings.component
          id={id}
          key={id}
          controlComponent={ControlComponent}
          onClick={toggleState}
          state={state}
        />
      );
  }
}
