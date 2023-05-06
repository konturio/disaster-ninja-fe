import { generateLayerStyleFromBivariateLegend } from '~utils/bivariate/bivariateColorThemeUtils';
import type { BivariateLegend } from '~core/logical_layers/types/legends';
import type { AnyLayer } from 'maplibre-gl';

export function generateLayerFromLegend(
  legend: BivariateLegend,
  sourceLayer: string,
): Omit<AnyLayer, 'id'> {
  if (legend.type === 'bivariate') {
    return generateLayerStyleFromBivariateLegend(legend, sourceLayer);
  }
  throw new Error(`Unexpected legend type '${legend.type}'`);
}
