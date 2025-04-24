import type { ColorsBySentiments } from '../types';

export const DEFAULT_GREEN = 'rgba(90, 200, 127, 0.5)';
export const DEFAULT_RED = 'rgba(228, 26, 28, 0.5)';
export const DEFAULT_YELLOW = 'rgba(251,237,170,0.5)';
export const sentimentDefault: [string, string] = ['bad', 'good'];
export const sentimentReversed: [string, string] = ['good', 'bad'];

export const DEFAULT_MCDA_COLORS_BY_SENTIMENT: ColorsBySentiments = {
  type: 'sentiments',
  parameters: {
    bad: DEFAULT_RED,
    good: DEFAULT_GREEN,
    midpoints: [{ value: 0.5, color: DEFAULT_YELLOW }],
  },
};
