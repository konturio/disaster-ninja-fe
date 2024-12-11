import { atom, type Ctx } from '@reatom/framework';
import { bivariateNumeratorsAtom } from '~features/bivariate_manager/atoms/bivariateNumerators';
import { bivariateStatisticsResourceAtom } from '~core/resources/bivariateStatisticsResource';
import type { AxisGroup, CorrelationMatrix } from '~core/types';
import type { CorrelationRate } from '~utils/bivariate/types/stat.types';

function covertGroupToObject(groups: AxisGroup[]) {
  return groups.reduce(
    (acc, gr, index) => {
      acc[JSON.stringify(gr.selectedQuotient)] = index;
      return acc;
    },
    {} as Record<string, number>,
  );
}

export const bivariateCorrelationMatrixAtom = atom<CorrelationMatrix | null>(
  (ctx, state: CorrelationMatrix | null = null) => {
    const { xGroups, yGroups } = ctx.spy(bivariateNumeratorsAtom);
    if (xGroups.length && yGroups.length) {
      const { data: stats } = ctx.get(bivariateStatisticsResourceAtom.v3atom);

      if (stats === null) return null;
      const correlationRates: CorrelationRate[] = stats.correlationRates;

      // init empty matrix
      const matrix: CorrelationMatrix = [];
      for (let i = 0; i < yGroups.length; i += 1) {
        matrix.push([]);
        for (let j = 0; j < xGroups.length; j += 1) {
          matrix[i].push(null);
        }
      }

      // convert groups to objects to get rig of O(N2) complexity while calculating result matrix
      const xGroupsConverted = covertGroupToObject(xGroups);
      const yGroupsConverted = covertGroupToObject(yGroups);

      for (let k = 0; k < correlationRates.length; k += 1) {
        const cr = correlationRates[k];
        const quotX = JSON.stringify(cr.x.quotient);
        if (xGroupsConverted.hasOwnProperty(quotX)) {
          const jIndex = xGroupsConverted[quotX];

          const quotY = JSON.stringify(cr.y.quotient);
          if (yGroupsConverted.hasOwnProperty(quotY)) {
            const iIndex = yGroupsConverted[quotY];
            matrix[iIndex][jIndex] = cr.rate;
          }
        }
      }

      state = matrix;
    }

    return state;
  },
  'bivariateCorrelationMatrixAtom',
);
