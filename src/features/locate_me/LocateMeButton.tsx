import { Locate24 } from '@konturio/default-icons';
import { useState, useCallback, useEffect } from 'react';
import { KonturSpinner } from '~components/LoadingSpinner/KonturSpinner';
import { i18n } from '~core/localization';
import { currentNotificationAtom } from '~core/shared_state';
import { setCurrentMapPosition } from '~core/shared_state/currentMapPosition';
import { store } from '~core/store/store';
import { LOCATE_ME_CONTROL_NAME, LOCATE_ME_ZOOM } from './constants';
import type { WidgetProps } from '~core/toolbar/types';

export function LocateMeButton({
  controlComponent: ControlComponent,
  onClick,
  state,
}: WidgetProps) {
  const [isLocating, setIsLocating] = useState(false);

  const handleClick = useCallback(() => {
    setIsLocating(true);
  }, []);

  useEffect(() => {
    if (!isLocating) return;

    navigator.geolocation.getCurrentPosition(
      (location) => {
        const { latitude: lat, longitude: lng } = location.coords;
        setCurrentMapPosition(store.v3ctx, { lat, lng, zoom: LOCATE_ME_ZOOM });
        onClick?.();
        setIsLocating(false);
      },
      (error) => {
        currentNotificationAtom.showNotification.dispatch(
          'warning',
          { title: error.message || i18n.t('locate_me.get_location_error') },
          3,
        );
        setIsLocating(false);
      },
    );
  }, [isLocating, onClick]);

  return (
    <ControlComponent
      size="tiny"
      icon={
        isLocating ? <KonturSpinner size={16} /> : <Locate24 width={16} height={16} />
      }
      onClick={handleClick}
      active={state === 'active'}
      disabled={state === 'disabled'}
      hint={LOCATE_ME_CONTROL_NAME}
    >
      {LOCATE_ME_CONTROL_NAME}
    </ControlComponent>
  );
}
