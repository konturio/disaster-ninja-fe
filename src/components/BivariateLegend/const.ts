import core from '~core/index';

export const BIVARIATE_LEGEND_SIZE = 3;

export const CORNER_POINTS_INDEXES = [
  0,
  BIVARIATE_LEGEND_SIZE - 1,
  BIVARIATE_LEGEND_SIZE * BIVARIATE_LEGEND_SIZE - BIVARIATE_LEGEND_SIZE,
  BIVARIATE_LEGEND_SIZE * BIVARIATE_LEGEND_SIZE - 1,
];

export const LOW = `↓${core.i18n.t('bivariate.legend.low')}`;
export const HIGH = `↑${core.i18n.t('bivariate.legend.high')}`;
export const MEDIUM = core.i18n.t('bivariate.legend.medium');

// functions below are needed to check if cell is located on any side of the bivariate legend matrix
export const isTopSide = (index: number): boolean =>
  Array.from(Array(BIVARIATE_LEGEND_SIZE), (_, i) => i).includes(index);

export const isBottomSide = (index: number): boolean => {
  const bottomRowStartIndex =
    BIVARIATE_LEGEND_SIZE * BIVARIATE_LEGEND_SIZE - BIVARIATE_LEGEND_SIZE;
  return Array.from(
    Array(BIVARIATE_LEGEND_SIZE),
    (_, i) => bottomRowStartIndex + i,
  ).includes(index);
};

export const isLeftSide = (index: number): boolean =>
  Array.from(Array(BIVARIATE_LEGEND_SIZE), (_, i) => i * BIVARIATE_LEGEND_SIZE).includes(
    index,
  );

export const isRightSide = (index: number): boolean =>
  Array.from(
    Array(BIVARIATE_LEGEND_SIZE),
    (_, i) => i * BIVARIATE_LEGEND_SIZE + (BIVARIATE_LEGEND_SIZE - 1),
  ).includes(index);
