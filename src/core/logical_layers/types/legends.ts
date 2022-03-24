import type { Axis } from '@k2-packages/bivariate-tools';

type SimpleLegendStepType = 'square' | 'circle' | 'hex';
interface MapCSSProperties {
  [key: string]: any;
  // Add bivariate steps
}

export interface SimpleLegendStep {
  paramName?: string;
  paramValue?: string | number;
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
  type: 'bivariate';
  axis: {
    x: Axis & { label?: string };
    y: Axis & { label?: string };
  };
  steps: BivariateLegendStep[];
}

export interface BivariateDetailsLegend {
  type: 'bivariate';
  bivariateAxes: {
    x: Axis & { label?: string };
    y: Axis & { label?: string };
  };
  bivariateColors: Record<string, string>;
}

export interface BivariateLegendBackend {
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

export type LayerDetailsLegend =
  | SimpleLegend
  | BivariateDetailsLegend;
