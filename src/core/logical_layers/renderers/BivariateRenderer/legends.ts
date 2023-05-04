import { generateLayerStyleFromBivariateLegend } from '~utils/bivariate/bivariateColorThemeUtils';
import type { BivariateLegend } from '~core/logical_layers/types/legends';
import type { AnyLayer } from 'maplibre-gl';

export function generateLayerFromLegend(legend: BivariateLegend): Omit<AnyLayer, 'id'> {
  if (legend.type === 'bivariate') {
    return generateLayerStyleFromBivariateLegend(legend);
  }
  throw new Error(`Unexpected legend type '${legend.type}'`);
}
