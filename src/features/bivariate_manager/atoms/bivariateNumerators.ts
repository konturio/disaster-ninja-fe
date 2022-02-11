import { createBindAtom } from '~utils/atoms';
import { bivariateStatisticsResourceAtom } from '~features/bivariate_manager/atoms/bivariateStatisticsResource';
import { Stat } from '@k2-packages/bivariate-tools';
import { NumeratorWithDenominators } from '~core/types';

const extractAvailableNumeratorsWithDenominators = (stat: Stat) => {
  const { correlationRates } = stat;
  const x: NumeratorWithDenominators[] = [];
  const y: NumeratorWithDenominators[] = [];
  correlationRates.forEach(
    ({
      x: {
        quotient: [xNumerator, xDenominator],
      },
      y: {
        quotient: [yNumerator, yDenominator],
      },
    }) => {
      if (
        !x.find(
          (i) =>
            i.numeratorId === xNumerator && i.denominators[0] === xDenominator,
        )
      ) {
        x.push({
          numeratorId: xNumerator,
          denominators: [xDenominator],
          selectedDenominator: xDenominator,
        });
      }

      if (
        !y.find(
          (i) =>
            i.numeratorId === yNumerator && i.denominators[0] === yDenominator,
        )
      ) {
        y.push({
          numeratorId: yNumerator,
          denominators: [yDenominator],
          selectedDenominator: yDenominator,
        });
      }
    },
  );

  return { x, y };
};

export const bivariateNumeratorsAtom = createBindAtom(
  {
    setNumerators: (
      numxX: NumeratorWithDenominators[],
      numsY: NumeratorWithDenominators[],
    ) => ({ xNumerators: numxX, yNumerators: numsY }),
    bivariateStatisticsResourceAtom,
  },
  (
    { get, onAction, onChange },
    state: {
      xNumerators: NumeratorWithDenominators[];
      yNumerators: NumeratorWithDenominators[];
    } = { xNumerators: [], yNumerators: [] },
  ) => {
    onChange(
      'bivariateStatisticsResourceAtom',
      ({ data: statisticsData, loading }) => {
        if (statisticsData && !loading) {
          const stats: Stat =
            statisticsData.polygonStatistic.bivariateStatistic;

          // get all available numerators with denominators
          const numerators = extractAvailableNumeratorsWithDenominators(stats);

          const numsX: NumeratorWithDenominators[] = [];
          for (const { numeratorId, denominators } of numerators.x) {
            for (const denominatorId of denominators) {
              numsX.push({
                numeratorId,
                denominators: [denominatorId],
                selectedDenominator: denominatorId,
              });
            }
          }

          const numsY: NumeratorWithDenominators[] = [];
          for (const { numeratorId, denominators } of numerators.y) {
            for (const denominatorId of denominators) {
              numsY.push({
                numeratorId,
                denominators: [denominatorId],
                selectedDenominator: denominatorId,
              });
            }
          }

          state = { xNumerators: numsX, yNumerators: numsY };
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
