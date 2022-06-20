export type BivariateMatrixQuotientType = {
  id: [string, string];
  label?: string;
  quality?: number;
};

export type BivariateMatrixHeadingType = {
  label: string;
  selectedQuotient: BivariateMatrixQuotientType;
  quality?: number;
  quotients: BivariateMatrixQuotientType[];
};

export type CornerRange =
  | 'good'
  | 'bad'
  | 'important'
  | 'unimportant'
  | 'neutral';

export type Copyright = string;

export type Direction = [Array<CornerRange>, Array<CornerRange>];

export type Indicator = {
  name: string;
  label: string;
  direction: Direction;
  copyrights: Copyright[];
};
