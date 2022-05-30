import { Stat } from '../types/stat.types';

type NumeratorWithDenominators = {
  numeratorId: string;
  denominators: string[];
};

export const extractAvailableNumeratorsWithDenominators = (
  stat: Stat,
): { x: NumeratorWithDenominators[]; y: NumeratorWithDenominators[] } => {
  const { correlationRates } = stat;

  const xSetMap: Map<string, Set<string>> = new Map<string, Set<string>>();
  const ySetMap: Map<string, Set<string>> = new Map<string, Set<string>>();

  correlationRates.forEach(
    ({
      x: {
        quotient: [xNumerator, xDenominator],
      },
      y: {
        quotient: [yNumerator, yDenominator],
      },
    }) => {
      if (!xSetMap.has(xNumerator)) {
        xSetMap.set(xNumerator, new Set<string>([xDenominator]));
      } else {
        xSetMap.get(xNumerator)?.add(xDenominator);
      }

      if (!ySetMap.has(yNumerator)) {
        ySetMap.set(yNumerator, new Set<string>([yDenominator]));
      } else {
        ySetMap.get(yNumerator)?.add(yDenominator);
      }
    },
  );

  const res: {
    x: NumeratorWithDenominators[];
    y: NumeratorWithDenominators[];
  } = { x: [], y: [] };

  xSetMap.forEach((denominatorsSet, numeratorId) => {
    res.x.push({
      numeratorId,
      denominators: Array.from(denominatorsSet),
    });
  });

  ySetMap.forEach((denominatorsSet, numeratorId) => {
    res.y.push({
      numeratorId,
      denominators: Array.from(denominatorsSet),
    });
  });

  return res;
};
