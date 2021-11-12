import { Axis } from '@k2-packages/bivariate-tools';

type SimpleLegendStepType = 'square' | 'circle' | 'hex';
interface MapCSSProperties {
  [key: string]: unknown;
  // Add bivariate steps
}

export interface SimpleLegend {
  name: string;
  type: 'simple';
  steps: {
    paramName: string;
    paramValue: string | number;
    stepName: string;
    stepShape: SimpleLegendStepType;
    style: MapCSSProperties;
  };
}

export interface BivariateLegend {
  name: string;
  description: string;
  type: 'bivariate';
  axis: {
    x: Axis;
    y: Axis;
  };
  steps: { label: string; color: string }[];
}

export type LayerLegend = SimpleLegend | BivariateLegend;
