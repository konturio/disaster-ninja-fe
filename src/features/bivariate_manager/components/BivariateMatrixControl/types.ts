export type BivariateMatrixQuotientType = {
  id: [string, string];
  label?: string;
  quality?: string;
};

export type BivariateMatrixHeadingType = {
  label: string;
  selectedQuotient: BivariateMatrixQuotientType;
  quality?: string;
  quotients: BivariateMatrixQuotientType[];
};

export type CornerRange = 'good' | 'bad' | 'important' | 'unimportant' | 'neutral';

export type Copyright = string;

export type Direction = [Array<CornerRange>, Array<CornerRange>];
