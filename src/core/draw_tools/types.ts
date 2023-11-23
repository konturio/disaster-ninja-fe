type DrawToolsState = 'regular' | 'active' | 'disabled';

export interface DrawToolController {
  name: string;
  hint: string;
  icon: string;
  state: DrawToolsState;
  action: () => void;
  prefferedSize?: 'tiny' | 'small' | 'medium' | 'large';
}

export interface DrawToolsController {
  init: () => void;
  dissolve: () => void;
  edit: (
    geometry: GeoJSON.FeatureCollection | GeoJSON.Feature,
  ) => Promise<GeoJSON.FeatureCollection>;
  exit: () => void;
  isActivated: boolean;
  geometry: GeoJSON.FeatureCollection;
}

interface Actions {
  finishDrawing: () => void;
  cancelDrawing: () => void;
}
export type DrawToolsHook = () => [Array<DrawToolController>, Actions];
