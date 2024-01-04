import type { Action, AtomSelfBinded } from '@reatom/core-v2';
import type { LayerAtom } from './logicalLayer';
import type { LogicalLayerRenderer } from './renderer';

export interface RegisterRequest {
  id: string;
  renderer: LogicalLayerRenderer;
  registry?: LayerRegistryAtom;
  /**
   * TODO: Add action to registry for extend clean effect, or auto-cleanup it
   *  */
  cleanUpActions?: Action[];
  map?: maplibregl.Map;
}

export type LayerRegistryAtom = AtomSelfBinded<
  Map<string, LayerAtom>,
  {
    register: (request: RegisterRequest | RegisterRequest[]) => RegisterRequest[];
    unregister: (
      id: string | string[],
      options?: { notifyLayerAboutDestroy?: boolean },
    ) => { ids: string[]; notifyLayerAboutDestroy?: boolean };
  }
>;
