import type { ButtonProps } from '@konturio/ui-kit/tslib/Button';

type DrawToolsState = 'regular' | 'active' | 'disabled';

export interface DrawToolController {
  name: string;
  hint: string;
  icon: string;
  state: DrawToolsState;
  action: () => void;
  prefferedSize?: ButtonProps['size'];
  mobilePreferredSize?: ButtonProps['size'];
}

export interface DrawToolsController {
  init: () => void;
  dissolve: () => void;
  edit: (geometry: GeoJSON.GeoJSON) => Promise<GeoJSON.FeatureCollection | null>;
  exit: () => void;
  isActivated: boolean;
  geometry: GeoJSON.FeatureCollection;
}

interface Actions {
  finishDrawing: () => void;
  cancelDrawing: () => void;
}
export type DrawToolsHook = () => [Array<DrawToolController>, Actions];
