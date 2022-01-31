import type { Axis } from '@k2-packages/bivariate-tools';
import { Action, ActionCreator, Atom, Fn, Rec } from '@reatom/core';
import type { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import type { BivariateLayer } from '~features/bivariate_manager/layers/BivariateLayer';
import type { FocusedGeometryLayer } from '~features/focused_geometry_layer/layers/FocusedGeometryLayer';
import type { GenericLayer } from '~features/layers_in_area/layers/GenericLayer';

type SimpleLegendStepType = 'square' | 'circle' | 'hex';
interface MapCSSProperties {
  [key: string]: any;
  // Add bivariate steps
}

export interface SimpleLegendStep {
  paramName: string;
  paramValue: string | number;
  stepName: string;
  stepShape: SimpleLegendStepType;
  sourceLayer?: string; // Required for vector tile source, unnecessary for other
  style: MapCSSProperties;
}

export interface SimpleLegend {
  name: string;
  linkProperty?: string;
  type: 'simple';
  steps: SimpleLegendStep[];
}

export interface BivariateLegendStep {
  label: string;
  color: string;
}

export interface BivariateLegend {
  name: string;
  linkProperty?: string;
  description: string;
  type: 'bivariate';
  axis: {
    x: Axis;
    y: Axis;
  };
  steps: BivariateLegendStep[];
  copyrights: string[];
}

export interface BivariateLegendBackend {
  name: string;
  type: 'bivariate';
  axes: {
    x: Axis;
    y: Axis;
  };
  colors: { id: string; color: string }[];
  steps: BivariateLegendStep[];
}

export type LayerLegend =
  | SimpleLegend
  | BivariateLegend
  | BivariateLegendBackend;

export interface LogicalLayer<T = null> {
  id: string;
  name?: string;
  legend?: LayerLegend;
  description?: string;
  copyrights?: string | string[];
  readonly group?: string;
  readonly category?: string;
  onInit(): { isVisible?: boolean; isLoading?: boolean };
  willEnabled?(map?: ApplicationMap): Action[] | void;
  willDisabled?(map?: ApplicationMap): Action[] | void;
  willMount(map: ApplicationMap): void | Promise<LayerLegend | null>;
  willUnmount(map: ApplicationMap): void | Promise<unknown>;
  willHide?: (map: ApplicationMap) => void;
  willUnhide?: (map: ApplicationMap) => void;
  wasAddInRegistry?: (
    map: ApplicationMap,
  ) => { isVisible?: boolean; isLoading?: boolean } | void;
  wasRemoveFromInRegistry?: (
    map: ApplicationMap,
  ) => { isVisible?: boolean; isLoading?: boolean } | void;
  onDataChange?: (
    map: ApplicationMap | null,
    data: T,
    state: Omit<LogicalLayerAtomState, 'id' | 'layer'>,
  ) => void;
  isDownloadable?: boolean;
  onDownload?: (map: ApplicationMap) => any;
}

export interface LogicalLayerAtomState {
  id: string;
  isEnabled: boolean;
  isMounted: boolean;
  isVisible: boolean;
  isLoading: boolean;
  isError: boolean;
  layer: LogicalLayer<any>;
}

// Rec<PayloadMapper | Atom<any>>
declare type PayloadMapper = Fn;
export interface LogicalLayerAtomActions<T>
  extends Rec<PayloadMapper | Atom | ActionCreator> {
  init: () => undefined;
  mount: () => undefined;
  unmount: () => undefined;
  hide: () => undefined;
  unhide: () => undefined;
  enable: () => undefined;
  disable: () => undefined;
  register: () => undefined;
  unregister: () => undefined;
  download: () => undefined;
  setData: (data: T) => T;
  _updateState: ({
    isLoading,
    isMounted,
    isVisible,
    isError,
    isEnabled,
  }: Partial<LogicalLayerAtomState>) => Partial<LogicalLayerAtomState>;
}
