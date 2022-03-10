import { createAtom } from '~utils/atoms';
import { bivariateStatisticsResourceAtom } from '~features/bivariate_manager/atoms/bivariateStatisticsResource';
import { Stat } from '@k2-packages/bivariate-tools';
import { AxisGroup } from '~core/types';

const extractAvailableNumeratorsWithDenominators = (stat: Stat) => {
  const { correlationRates } = stat;
  const x: AxisGroup[] = [];
  const y: AxisGroup[] = [];
  for (const {
    x: { quotient: xQuotient, parent: xParent },
    y: { quotient: yQuotient, parent: yParent },
  } of correlationRates) {
    if (xParent) {
      let group = x.find((g) => g.parent === JSON.stringify(xParent));
      if (!group) {
        group = {
          parent: JSON.stringify(xParent),
          quotients: [xQuotient],
          selectedQuotient: xQuotient,
        };
        x.push(group);
      } else if (
        !group.quotients.find(
          (q) => JSON.stringify(q) === JSON.stringify(xQuotient),
        )
      ) {
        group.quotients.push(xQuotient);
      }
    } else if (
      !x.find(
        (g) => JSON.stringify(g.selectedQuotient) === JSON.stringify(xQuotient),
      )
    ) {
      x.push({
        parent: null,
        quotients: [xQuotient],
        selectedQuotient: xQuotient,
      });
    }

    if (yParent) {
      let group = y.find((g) => g.parent === JSON.stringify(yParent));
      if (!group) {
        group = {
          parent: JSON.stringify(yParent),
          quotients: [yQuotient],
          selectedQuotient: yQuotient,
        };
        y.push(group);
      } else if (
        !group.quotients.find(
          (q) => JSON.stringify(q) === JSON.stringify(yQuotient),
        )
      ) {
        group.quotients.push(yQuotient);
      }
    } else if (
      !y.find(
        (g) => JSON.stringify(g.selectedQuotient) === JSON.stringify(yQuotient),
      )
    ) {
      y.push({
        parent: null,
        quotients: [yQuotient],
        selectedQuotient: yQuotient,
      });
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
