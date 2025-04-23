import { configRepo } from '~core/config';
import { adaptTileUrl } from '~utils/bivariate/tile/adaptTileUrl';
import type { TileSource } from '~core/logical_layers/types/source';

// hard coded to HOT layers for now (task 7801)
export const IMPORTANT_BIVARIATE_LAYERS = [
  ['count', 'area_km2'],
  ['building_count', 'area_km2'],
  ['highway_length', 'area_km2'],
  ['local_hours', 'area_km2'],
  ['avgmax_ts', 'one'],
  ['days_mintemp_above_25c_1c', 'one'],
  ['population', 'area_km2'],
  ['total_hours', 'area_km2'],
  ['view_count', 'area_km2'],
];

export const DEFAULT_BIVARIATE_TILES_URL = `${adaptTileUrl(
  configRepo.get().bivariateTilesRelativeUrl,
)}{z}/{x}/{y}.mvt?indicatorsClass=${configRepo.get().bivariateTilesIndicatorsClass}`;

export const DEFAULT_BIVARIATE_TILE_SOURCE: TileSource = {
  type: 'vector' as const,
  urls: [DEFAULT_BIVARIATE_TILES_URL],
  tileSize: 512,
  apiKey: '',
};
