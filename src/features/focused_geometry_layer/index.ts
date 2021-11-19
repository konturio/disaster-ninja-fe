import { focusedGeometryLayerAtom } from './atoms/focusedGeometryLayer';
import { logicalLayersRegistryAtom } from '~core/shared_state/logicalLayersRegistry';

export function initFocusedGeometryLayer() {
  logicalLayersRegistryAtom.registerLayer.dispatch(focusedGeometryLayerAtom);
  focusedGeometryLayerAtom.init.dispatch();
  focusedGeometryLayerAtom.mount.dispatch();
  focusedGeometryLayerAtom.subscribe(() => null);
}
