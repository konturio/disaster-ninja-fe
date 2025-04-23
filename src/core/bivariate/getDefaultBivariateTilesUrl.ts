import { configRepo } from '~core/config';
import { adaptTileUrl } from '~utils/bivariate/tile/adaptTileUrl';

export function getDefaultBivariateTilesUrl() {
  return `${adaptTileUrl(
    configRepo.get().bivariateTilesRelativeUrl,
  )}{z}/{x}/{y}.mvt?indicatorsClass=${configRepo.get().bivariateTilesIndicatorsClass}`;
}
