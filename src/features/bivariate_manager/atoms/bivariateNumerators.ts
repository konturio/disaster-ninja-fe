import { action, atom, type Ctx } from '@reatom/framework';
import { bivariateStatisticsResourceAtom } from '~core/resources/bivariateStatisticsResource';
import type { StatDTO } from '~core/resources/bivariateStatisticsResource/types';
import type { AxisGroup } from '~core/types';

function extractAvailableNumeratorsWithDenominators(stat: StatDTO) {
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
      !xGroup.quotients.find((q) => JSON.stringify(q) === JSON.stringify(xQuotient))
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
      !yGroup.quotients.find((q) => JSON.stringify(q) === JSON.stringify(yQuotient))
    ) {
      yGroup.quotients.push(yQuotient);
    }
  }

  for (const group of x) {
    const parent = group.quotients.find((q) => JSON.stringify(q) === group.parent);
    if (parent) {
      group.selectedQuotient = parent;
    }
  }

  for (const group of y) {
    const parent = group.quotients.find((q) => JSON.stringify(q) === group.parent);
    if (parent) {
      group.selectedQuotient = parent;
    }
  }

  return { x, y };
}

interface BivariateNumerators {
  xGroups: AxisGroup[];
  yGroups: AxisGroup[];
}

export const bivariateNumeratorsAtom = atom<BivariateNumerators>(
  (ctx, state = { xGroups: [], yGroups: [] }) => {
    const { data: stats, loading } = ctx.spy(bivariateStatisticsResourceAtom.v3atom);
    if (stats && !loading) {
      // get all available numerators with denominators
      const numerators = extractAvailableNumeratorsWithDenominators(stats);
      return { xGroups: numerators.x, yGroups: numerators.y };
    }
    return state;
  },
  'bivariateNumeratorsAtom',
);

export const setNumeratorsAction = action((ctx, nums: BivariateNumerators) => {
  // @ts-expect-error - v3 issues?
  bivariateNumeratorsAtom(ctx, nums);
}, 'setNumeratorsAction');
