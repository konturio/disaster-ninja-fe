import { focusedGeometryLayerAtom } from './atoms/focusedGeometryLayer';
import { logicalLayersRegistryAtom, currentMapAtom } from '~core/shared_state';
import { visibilityWatcherAtom } from './atoms/visibilityWatcherAtom';

export function initFocusedGeometryLayer() {
  setTimeout(() => {
    logicalLayersRegistryAtom.registerLayer.dispatch(focusedGeometryLayerAtom);
    focusedGeometryLayerAtom.init.dispatch();
    focusedGeometryLayerAtom.subscribe(() => null);
    visibilityWatcherAtom.subscribe(() => null);
  }, 0);
}
