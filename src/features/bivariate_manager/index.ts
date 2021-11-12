import { bivariateOverlayLayersAtom } from '~features/bivariate_manager/atoms/bivariateOverlayLayers';

export function initBivariateManager() {
  bivariateOverlayLayersAtom.subscribe(() => null);
}
