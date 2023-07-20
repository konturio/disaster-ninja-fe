import { generateLayerStyleFromBivariateLegend } from '~utils/bivariate/bivariateColorThemeUtils';
import type { BivariateLegend } from '~core/logical_layers/types/legends';
import type { LayerSpecification } from 'maplibre-gl';

export function generateLayerFromLegend(
  legend: BivariateLegend,
  sourceLayer: string,
): Omit<LayerSpecification, 'id'> {
  if (legend.type === 'bivariate') {
    // @ts-expect-error LayerSpecification issues
    return generateLayerStyleFromBivariateLegend(legend, sourceLayer);
  }
  throw new Error(`Unexpected legend type '${legend.type}'`);
}
