import { createAtom } from '~core/store/atoms/createPrimitives';
import { setMapInteractivity } from '~utils/map/setMapInteractivity';
import { registerMapListener } from '~core/map/atoms/mapListeners';
import core from '~core/index';

interface ScheduleContext {
  removeClickListener?: () => void;
}

let isAtomEnabled = false;
export const clickCoordinatesAtom = createAtom(
  {
    currentMapAtom: core.sharedState.currentMapAtom,
    _set: (coords: { lng: number; lat: number }) => coords,
    start: () => null,
    stop: () => null,
  },
  (
    { onChange, onAction, schedule, create, get },
    state: null | { lat: number; lng: number } = null,
  ) => {
    const enableListeners = (map: maplibregl.Map) =>
      schedule((dispatch, ctx: ScheduleContext = {}) => {
        ctx.removeClickListener ??= registerMapListener(
          'click',
          (e) => {
            dispatch(
              create('_set', {
                lng: e.lngLat.lng,
                lat: e.lngLat.lat,
              }),
            );
            return false;
          },
          10,
        );
        setMapInteractivity(map, false);
      });

    const disableListeners = (map: maplibregl.Map) =>
      schedule((dispatch, ctx: ScheduleContext = {}) => {
        setMapInteractivity(map, true);
        ctx.removeClickListener?.();
        delete ctx.removeClickListener;
      });

    onAction('_set', (coords) => {
      state = coords;
    });

    onAction('start', () => {
      isAtomEnabled = true;
      const map = get('currentMapAtom');
      if (!map) return;
      enableListeners(map);
    });

    onAction('stop', () => {
      isAtomEnabled = false;
      const map = get('currentMapAtom');
      state = null;
      if (!map) return;
      disableListeners(map);
    });

    onChange('currentMapAtom', (map) => {
      if (!map) return;
      if (isAtomEnabled) {
        enableListeners(map);
      }
    });

    return state;
  },
);
