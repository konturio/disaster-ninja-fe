import { createAtom } from '~utils/atoms/createPrimitives';
import { currentMapAtom } from '~core/shared_state';
import { setMapInteractivity } from '~utils/map/setMapInteractivity';
import { registerMapListener } from '~core/shared_state/mapListeners';
import { store } from '~core/store/store';
import { boundarySelectorControl } from '../control';

interface ScheduleContext {
  removeClickListener?: () => void;
  removeMousemoveListener?: () => void;
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
        // Record map clicks
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
        // Disable active listeners of mouse move
        ctx.removeMousemoveListener ??= registerMapListener(
          'mousemove',
          () => false, // Catch mouse move event. False stop event propagation
          10,
        );
        setMapInteractivity(map, false); // Disable default map interactivity
      });

    const disableListeners = (map: maplibregl.Map) =>
      schedule((dispatch, ctx: ScheduleContext = {}) => {
        setMapInteractivity(map, true);
        ctx.removeClickListener?.();
        ctx.removeMousemoveListener?.();
        delete ctx.removeClickListener;
        delete ctx.removeMousemoveListener;
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
  'clickCoordinatesAtom',
);

boundarySelectorControl.onStateChange((ctx, state) => {
  if (state === 'active') {
    store.dispatch(clickCoordinatesAtom.start());
  } else {
    store.dispatch(clickCoordinatesAtom.stop());
  }
});
