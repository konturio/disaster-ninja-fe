import { Locate24 } from '@konturio/default-icons';
import { Spinner } from '@konturio/ui-kit';
import { useState, useCallback, useEffect, useRef } from 'react';
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
  id,
}: WidgetProps) {
  const [isLocating, setIsLocating] = useState(false);

  const watchIdRef = useRef<number>();

  const handleClick = useCallback(() => {
    setIsLocating(true);
    onClick();
  }, [onClick]);

  useEffect(() => {
    if (!isLocating) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (location) => {
        const { latitude: lat, longitude: lng } = location.coords;
        setCurrentMapPosition(store.v3ctx, { lat, lng, zoom: LOCATE_ME_ZOOM });
        if (watchIdRef.current !== undefined) {
          navigator.geolocation.clearWatch(watchIdRef.current);
        }
        setIsLocating(false);
      },
      (error) => {
        currentNotificationAtom.showNotification.dispatch(
          'warning',
          { title: error.message || i18n.t('locate_me.get_location_error') },
          3,
        );
        if (watchIdRef.current !== undefined) {
          navigator.geolocation.clearWatch(watchIdRef.current);
        }
        setIsLocating(false);
      },
    );

    return () => {
      if (watchIdRef.current !== undefined) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isLocating]);

  return (
    <ControlComponent
      id={id}
      size="tiny"
      icon={isLocating ? <Spinner size={16} /> : <Locate24 width={16} height={16} />}
      onClick={handleClick}
      active={state === 'active'}
      disabled={state === 'disabled'}
    >
      {LOCATE_ME_CONTROL_NAME}
    </ControlComponent>
  );
}
