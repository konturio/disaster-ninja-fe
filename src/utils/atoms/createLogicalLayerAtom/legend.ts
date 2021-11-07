type SimpleLegendStepType = 'square' | 'circle' | 'hex';
interface MapCSSProperties {
  [key: string]: unknown;
  // Add bivariate steps
}

interface SimpleLegend {
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

interface BivariateLegend {
  name: string;
  type: 'bivariate';
  steps: [/* TODO: Add bivariate steps */];
}

export type LayerLegend = SimpleLegend | BivariateLegend;
