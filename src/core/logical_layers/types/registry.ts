import { Action, AtomSelfBinded } from '@reatom/core';
import type { LayerAtom } from './logicalLayer';
import type { LogicalLayerRenderer } from './renderer';

export interface RegisterRequest {
  id: string;
  renderer: LogicalLayerRenderer;
  registry?: LayerRegistryAtom;
  cleanUpActions?: Action[];
  enabledByDefault?: boolean;
}

export type LayerRegistryAtom = AtomSelfBinded<
  Map<string, LayerAtom>,
  {
    register: (
      request: RegisterRequest | RegisterRequest[],
    ) => RegisterRequest[];
    unregister: (
      id: string | string[],
      options?: { notifyLayerAboutDestroy?: boolean },
    ) => { ids: string[]; notifyLayerAboutDestroy?: boolean };
  }
>;
