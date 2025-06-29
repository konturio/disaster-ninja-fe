import { toolbar } from '~core/toolbar';
import { store } from '~core/store/store';
import { focusedGeometryAtom as focusedGeometryAtomV2 } from '~core/focused_geometry/model';
import { setCurrentMapBbox } from '~core/shared_state/currentMapPosition';
import { getBboxForGeometry } from '~utils/map/camera';
import { isGeoJSONEmpty } from '~utils/geoJSON/helpers';
import { i18n } from '~core/localization';
import { ZOOM_TO_CONTROL_ID, ZOOM_TO_CONTROL_NAME } from './constants';
import type { Unsubscribe } from '@reatom/framework';

let focusedGeometryUnsubscribe: Unsubscribe | null;
const focusedGeometryAtom = focusedGeometryAtomV2.v3atom;

export const zoomToControl = toolbar.setupControl({
  id: ZOOM_TO_CONTROL_ID,
  type: 'button',
  typeSettings: {
    name: ZOOM_TO_CONTROL_NAME,
    hint: i18n.t('toolbar.zoom_to'),
    icon: 'ZoomTo16',
    preferredSize: 'tiny',
  },
});

function geometryExists(geometry: GeoJSON.GeoJSON | null | undefined) {
  return !isGeoJSONEmpty(geometry);
}

zoomToControl.onStateChange((ctx, state) => {
  if (state === 'active') {
    const geometry = store.v3ctx.get(focusedGeometryAtom)?.geometry;
    if (geometryExists(geometry)) {
      const bbox = getBboxForGeometry(geometry!);
      if (bbox) setCurrentMapBbox(store.v3ctx, bbox);
    }
    store.dispatch(zoomToControl.setState('regular'));
  }
  if (state === 'regular') {
    if (!geometryExists(store.v3ctx.get(focusedGeometryAtom)?.geometry)) {
      store.dispatch(zoomToControl.setState('disabled'));
    }
  }
});

zoomToControl.onInit(() => {
  focusedGeometryUnsubscribe = store.v3ctx.subscribe(focusedGeometryAtom, (st) => {
    if (geometryExists(st?.geometry)) {
      store.dispatch(zoomToControl.setState('regular'));
    } else {
      store.dispatch(zoomToControl.setState('disabled'));
    }
  });
});

zoomToControl.onRemove(() => {
  focusedGeometryUnsubscribe?.();
  focusedGeometryUnsubscribe = null;
});

export function initZoomTo() {
  zoomToControl.init();
}
