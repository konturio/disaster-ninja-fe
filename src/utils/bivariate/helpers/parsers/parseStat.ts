import { ratesToTable } from '../converters/ratesToTable';
import { extractAvailableDenominators } from '../extractors/extractAvailableDenominators';
import { sortByExample } from '../sort/sortByExample';
import { createBivariateAxisesHashMap } from './createBivariateAxisesHashMap';
import { createCorrelationsHashMap } from './createCorrelationsHashMap';
import type { Axis, CorrelationRate, Stat } from '../../types/stat.types';
import type { Table } from '../converters/ratesToTable';

export type { Stat };
export type { Table };

export type DenominatorSelector = (
  x: string,
  y: string,
) => { table: Table; selectNumerators: NumeratorSelector } | null;

export type NumeratorSelector = (x: string, y: string) => { x: Axis; y: Axis } | null;

export function parseStat(stat: Stat) {
  /* selected denominators pair: data for bivariate legend */
  const bivariateAxisesHashMap = createBivariateAxisesHashMap(stat);

  /* selected denominators pair: data for corelation matrix */
  const correlationsHashMap = createCorrelationsHashMap(stat, bivariateAxisesHashMap);

  /* Data for denominators selectors */
  const [xDenominators, yDenominators] = extractAvailableDenominators(
    stat.correlationRates,
  );
  yDenominators.sort(sortByExample(xDenominators));

  /* Callback when use choice denominators */
  const onSelectDenominators: DenominatorSelector = (x, y) => {
    const dataSlice = correlationsHashMap.get(x, y) as CorrelationRate[];
    if (!dataSlice) return null;
    return {
      table: ratesToTable(dataSlice),
      /* Callback when use choice numerators (cell in matrix) */
      selectNumerators: (nX, nY) => {
        return {
          /**
           * *It's look like mistake or bug but it NOT A MISTAKE!
           * Matrix X -> Legend Y, and Matrix Y -> Legend X
           */
          x: bivariateAxisesHashMap.get(nY, y) as Axis,
          y: bivariateAxisesHashMap.get(nX, x) as Axis,
        };
      },
    };
  };

  return {
    xDenominators,
    yDenominators,
    onSelectDenominators,
  };
}
