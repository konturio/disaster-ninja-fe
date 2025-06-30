import papa from 'papaparse';
import type { AnalyticsData } from '~core/types';

export function analyticsToCsv(data: AnalyticsData[]): string {
  const rows = data.map((d) => ({
    xlabel: d.xlabel,
    ylabel: d.ylabel,
    prefix: d.prefix,
    value: d.value,
    unit: d.unit.shortName,
    formula: d.formula,
  }));
  return papa.unparse(rows);
}
