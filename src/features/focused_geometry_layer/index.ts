import { focusedGeometryLayerAtom } from './atoms/focusedGeometryLayer';
import { logicalLayersRegistryAtom, currentMapAtom } from '~core/shared_state';

export function initFocusedGeometryLayer() {
  logicalLayersRegistryAtom.registerLayer.dispatch(focusedGeometryLayerAtom);
  focusedGeometryLayerAtom.init.dispatch();
  focusedGeometryLayerAtom.subscribe(() => null);
  const unsubscribe = currentMapAtom.subscribe((map) => {
    if (map) {
      focusedGeometryLayerAtom.mount.dispatch();
      unsubscribe();
    }
  });
}
