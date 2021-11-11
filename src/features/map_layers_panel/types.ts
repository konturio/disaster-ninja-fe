import { LogicalLayer } from '~utils/atoms/createLogicalLayerAtom';
export type { LogicalLayerAtom } from '~utils/atoms/createLogicalLayerAtom';

export interface LayerWithState {
  id: string;
  layer: LogicalLayer;
  isMounted: boolean;
  isVisible: boolean;
  isLoading: boolean;
}
