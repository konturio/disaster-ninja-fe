import { createAtom } from '~utils/atoms/createPrimitives';
import { currentMapAtom } from '~core/shared_state';
import { setMapInteractivity } from '~utils/map/setMapInteractivity';

interface ScheduleContext {
  onMapClickListener?: (e: maplibregl.MapLayerEventType['click']) => void;
}

let isAtomEnabled = false;
export const clickCoordinatesAtom = createAtom(
  {
    currentMapAtom,
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
        ctx.onMapClickListener ??= ({ lngLat }) =>
          dispatch(
            create('_set', {
              lng: lngLat.lng,
              lat: lngLat.lat,
            }),
          );
        setMapInteractivity(map, false);
        map.on('click', ctx.onMapClickListener);
      });

    const disableListeners = (map: maplibregl.Map) =>
      schedule((dispatch, ctx: ScheduleContext = {}) => {
        setMapInteractivity(map, true);
        ctx.onMapClickListener && map.off('click', ctx.onMapClickListener);
        delete ctx.onMapClickListener;
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
