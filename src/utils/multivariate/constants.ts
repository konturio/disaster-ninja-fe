import type { Step } from '~utils/bivariate';

export const DEFAULT_MULTIBIVARIATE_STEPS: Step[] = [
  {
    value: 0,
  },
  {
    value: 0.33,
  },
  {
    value: 0.67,
  },
  {
    value: 1,
  },
];

export const DEFAULT_MULTIBIVARIATE_COLORS = [
  {
    id: 'A1',
    color: 'rgba(232, 232, 157, 0.5)',
  },
  {
    id: 'A2',
    color: 'rgba(229, 154, 55, 0.5)',
  },
  {
    id: 'A3',
    color: 'rgba(228, 26, 28, 0.5)',
  },
  {
    id: 'B1',
    color: 'rgba(203, 240, 211, 0.5)',
  },
  {
    id: 'B2',
    color: 'rgba(228, 185, 129, 0.5)',
  },
  {
    id: 'B3',
    color: 'rgba(228, 127, 129, 0.5)',
  },
  {
    id: 'C1',
    color: 'rgba(135, 198, 144, 0.5)',
  },
  {
    id: 'C2',
    color: 'rgba(109, 179, 92, 0.5)',
  },
  {
    id: 'C3',
    color: 'rgba(102, 154, 112, 0.5)',
  },
];
