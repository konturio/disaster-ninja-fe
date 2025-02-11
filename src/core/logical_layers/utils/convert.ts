import { legendFormatter } from '~core/logical_layers/utils/legendFormatter';
import type {
  LayerDetailsDto,
  LayerGeoJSONSource,
  LayerTileSource,
} from '~core/logical_layers/types/source';
import type { LayerLegend, MultivariateLegend } from '~core/logical_layers/types/legends';

export function convertDetailsToLegends(response: LayerDetailsDto): LayerLegend | null {
  if (!response.legend) {
    if (response.style?.type === 'multivariate') {
      return {
        type: 'multivariate',
        config: response.style.config,
      } as MultivariateLegend;
    }
    return null;
  }
  return legendFormatter(response);
}

export function convertDetailsToSource(response: LayerDetailsDto) {
  if (!response.source) {
    return null;
  }

  if (response.source.type === 'vector' || response.source.type === 'raster') {
    const source = response.source;
    return {
      ...response,
      source: {
        ...source,
        apiKey: '',
      },
    } as LayerTileSource;
  } else {
    return response as LayerGeoJSONSource;
  }
}
