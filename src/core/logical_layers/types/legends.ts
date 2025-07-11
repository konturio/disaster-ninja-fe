import type { LegendIconSize } from '~core/types';
import type { MultivariateLayerConfig } from '../renderers/MultivariateRenderer/types';
import type { Axis } from '~utils/bivariate';

type SimpleLegendStepType = 'square' | 'circle' | 'hex';
interface MapCSSProperties {
  [key: string]: any;
  // Add bivariate steps
}

export interface SimpleLegendStep {
  paramName?: string;
  paramValue?: string | number;
  stepIconFill?: string;
  stepIconStroke?: string;
  stepIconSize?: LegendIconSize;
  stepName: string | string[];
  stepShape: SimpleLegendStepType;
  sourceLayer?: string; // Required for vector tile source, unnecessary for other
  style: MapCSSProperties;
}

export interface SimpleLegend {
  type: 'simple';
  name: string;
  linkProperty?: string;
  steps: SimpleLegendStep[];
  tooltip?: {
    type: 'markdown';
    paramName: string;
  };
}

export interface BivariateLegendStep {
  label: string;
  color: string;
  isFallbackColor?: boolean;
}

export interface BivariateLegend {
  type: 'bivariate';
  name: string;
  linkProperty?: string;
  axis: {
    x: Axis & { label?: string };
    y: Axis & { label?: string };
  };
  steps: BivariateLegendStep[];
}

export interface BivariateLegendBackend {
  type: 'bivariate';
  name: string;
  axes: {
    x: Axis & { label?: string };
    y: Axis & { label?: string };
  };
  steps: BivariateLegendStep[];
  colors: { id: string; color: string }[];
}

export interface MCDALegend {
  type: 'mcda';
  title?: string;
  subtitle?: string;
  fromValue?: string;
  toValue?: string;
  /* Gradient colors */
  colors?: string[];
  /* How much sections needed on ruler */
  steps?: number;
}

export interface MultivariateLegend {
  type: 'multivariate';
  title?: string;
  steps?: BivariateLegendStep;
  config: MultivariateLayerConfig;
}

export type LayerLegend =
  | SimpleLegend
  | BivariateLegend
  | BivariateLegendBackend
  | MCDALegend
  | MultivariateLegend;

export type LayerDetailsLegend = SimpleLegend | BivariateLegendBackend;
