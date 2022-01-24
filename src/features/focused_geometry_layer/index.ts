import { focusedGeometryLayerAtom } from './atoms/focusedGeometryLayer';
import { logicalLayersRegistryAtom, currentMapAtom } from '~core/shared_state';

export function initFocusedGeometryLayer() {
  setTimeout(() => {
    logicalLayersRegistryAtom.registerLayer.dispatch(focusedGeometryLayerAtom);
    focusedGeometryLayerAtom.init.dispatch();
    focusedGeometryLayerAtom.subscribe(() => null);
    let timeout: number;
    const unsubscribe = currentMapAtom.subscribe((map) => {
      // Put in the end of callStack
      timeout && clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (map) {
          focusedGeometryLayerAtom.enable.dispatch();
          unsubscribe();
        }
      });
    });
  }, 0);
}
