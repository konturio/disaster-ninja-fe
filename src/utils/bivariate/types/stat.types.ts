/** Full docs: https://gist.github.com/Akiyamka/8ad19a8de3c955ac1f27f67281c12fdf#correlationrate */

export type CornerRange =
  | 'good'
  | 'bad'
  | 'important'
  | 'unimportant'
  | 'neutral';

export type OverlayColor = {
  id: string; // A1 - C3
  color: string; // rgb(0,0,0) - rgb(255,255,255)
};

export type Step = {
  label?: string;
  value: number;
};

/* Divisor and denominator pair */
export type Quotient = [string, string]; // this field will be removed in next tickets, only Quotients will stay
export type Quotients = {
  name: string;
  label: string;
  direction: Direction;
};

export type Axis = {
  steps: Step[];
  quotient: Quotient;
  quotients?: Quotients[];
  quality?: number;
  parent?: Quotient;
  label?: string;
};

export type CorrelationRate = {
  x: Axis;
  y: Axis;
  rate: number;
  avgCorrelationY?: number;
  avgCorrelationX?: number;
};

export type InitAxis = {
  x: Axis;
  y: Axis;
};

export type Meta = {
  min_zoom: number;
  max_zoom: number;
};

export type Copyright = string;

export type Direction = [Array<CornerRange>, Array<CornerRange>];

export type Indicator = {
  name: string;
  label: string;
  direction: Direction;
  copyrights: Copyright[];
};

export type ColorCombination = {
  color: string;
  corner: Array<CornerRange>;
  color_comment: string;
};

export interface Stat {
  axis: Axis[];
  meta: Meta;
  initAxis: InitAxis;
  correlationRates: CorrelationRate[];
  indicators: Indicator[];
  colors: {
    fallback: string;
    combinations: ColorCombination[];
  };
}
