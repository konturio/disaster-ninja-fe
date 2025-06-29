import { useEffect, useState } from 'react';
import { useAtom } from '@reatom/react-v2';
import { currentMapAtom } from '~core/shared_state';
import { toolbar } from '~core/toolbar';
import { i18n } from '~core/localization';
import { ToolbarIcon } from '~features/toolbar/components/ToolbarIcon';
import { RESET_NORTH_CONTROL_ID, RESET_NORTH_CONTROL_NAME } from './constants';
import type { WidgetProps } from '~core/toolbar/types';

function ResetNorthWidget({
  controlComponent: ControlComponent,
  state,
  onClick,
  id,
}: WidgetProps) {
  const [map] = useAtom(currentMapAtom);
  const [bearing, setBearing] = useState(0);

  useEffect(() => {
    if (!map) return;
    const update = () => setBearing(map.getBearing());
    map.on('rotate', update);
    update();
    return () => {
      map.off('rotate', update);
    };
  }, [map]);

  if (state === 'disabled') return null;

  const handleClick = () => {
    map?.resetNorth();
    onClick();
  };

  return (
    <ControlComponent
      id={id}
      icon={
        <span style={{ display: 'inline-block', transform: `rotate(${-bearing}deg)` }}>
          <ToolbarIcon icon="North16" width={16} height={16} />
        </span>
      }
      size="tiny"
      onClick={handleClick}
      disabled={state === 'disabled'}
    >
      {RESET_NORTH_CONTROL_NAME}
    </ControlComponent>
  );
}

export const resetNorthControl = toolbar.setupControl({
  id: RESET_NORTH_CONTROL_ID,
  type: 'widget',
  typeSettings: {
    component: ResetNorthWidget,
  },
});

export function initResetNorth() {
  resetNorthControl.init();
}
