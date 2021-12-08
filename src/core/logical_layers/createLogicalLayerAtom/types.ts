import type { Axis } from '@k2-packages/bivariate-tools';
import type { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';

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

export type LayerLegend = SimpleLegend | BivariateLegend;

export type LogicalLayerAtomState = {
  id: string;
  isMounted: boolean;
  isVisible: boolean;
  isLoading: boolean;
  isError: boolean;
};

export interface LogicalLayer<T = null> {
  id: string;
  name?: string;
  legend?: LayerLegend;
  description?: string;
  copyright?: string;
  readonly group?: string;
  readonly category?: string;
  onInit(): { isVisible?: boolean; isLoading?: boolean };
  willMount(map: ApplicationMap): void | Promise<unknown>;
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
    map: ApplicationMap,
    data: T,
    state: Omit<LogicalLayerAtomState, 'id'>,
  ) => void;
}
