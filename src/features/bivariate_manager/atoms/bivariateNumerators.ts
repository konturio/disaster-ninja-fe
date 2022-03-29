import { createAtom } from '~utils/atoms';
import { bivariateStatisticsResourceAtom } from '~features/bivariate_manager/atoms/bivariateStatisticsResource';
import { Stat } from '@k2-packages/bivariate-tools';
import { AxisGroup } from '~core/types';

const extractAvailableNumeratorsWithDenominators = (stat: Stat) => {
  const { correlationRates } = stat;
  const x: AxisGroup[] = [];
  const y: AxisGroup[] = [];
  for (const correlationRate of correlationRates) {
    const xQuotient = correlationRate.x.quotient;
    const xParent = correlationRate.x.parent || xQuotient;

    let xGroup = x.find((g) => g.parent === JSON.stringify(xParent));
    if (!xGroup) {
      xGroup = {
        parent: JSON.stringify(xParent),
        quotients: [xQuotient],
        selectedQuotient: xQuotient,
      };
      x.push(xGroup);
    } else if (
      !xGroup.quotients.find(
        (q) => JSON.stringify(q) === JSON.stringify(xQuotient),
      )
    ) {
      xGroup.quotients.push(xQuotient);
    }

    const yQuotient = correlationRate.y.quotient;
    const yParent = correlationRate.y.parent || yQuotient;

    let yGroup = y.find((g) => g.parent === JSON.stringify(yParent));
    if (!yGroup) {
      yGroup = {
        parent: JSON.stringify(yParent),
        quotients: [yQuotient],
        selectedQuotient: yQuotient,
      };
      y.push(yGroup);
    } else if (
      !yGroup.quotients.find(
        (q) => JSON.stringify(q) === JSON.stringify(yQuotient),
      )
    ) {
      yGroup.quotients.push(yQuotient);
    }
  }

  for (const group of x) {
    const parent = group.quotients.find(q => JSON.stringify(q) === group.parent);
    if (parent) {
      group.selectedQuotient = parent;
    }
  }

  for (const group of y) {
    const parent = group.quotients.find(q => JSON.stringify(q) === group.parent);
    if (parent) {
      group.selectedQuotient = parent;
    }
  }

  return { x, y };
};

export const bivariateNumeratorsAtom = createAtom(
  {
    setNumerators: (numxX: AxisGroup[], numsY: AxisGroup[]) => ({
      xGroups: numxX,
      yGroups: numsY,
    }),
    bivariateStatisticsResourceAtom,
  },
  (
    { get, onAction, onChange },
    state: {
      xGroups: AxisGroup[];
      yGroups: AxisGroup[];
    } = { xGroups: [], yGroups: [] },
  ) => {
    onChange(
      'bivariateStatisticsResourceAtom',
      ({ data: statisticsData, loading }) => {
        if (statisticsData && !loading) {
          const stats: Stat =
            statisticsData.polygonStatistic.bivariateStatistic;

          // get all available numerators with denominators
          const numerators = extractAvailableNumeratorsWithDenominators(stats);

          state = { xGroups: numerators.x, yGroups: numerators.y };
        }
      },
    );

    onAction('setNumerators', (nums) => {
      state = nums;
    });

    return state;
  },
  'bivariateNumerators',
);
