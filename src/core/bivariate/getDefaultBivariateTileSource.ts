import { getDefaultBivariateTilesUrl } from './getDefaultBivariateTilesUrl';
import type { TileSource } from '~core/logical_layers/types/source';

export function getDefaultBivariateTileSource(): TileSource {
  return {
    type: 'vector' as const,
    urls: [getDefaultBivariateTilesUrl()],
    tileSize: 512,
    apiKey: '',
  };
}
