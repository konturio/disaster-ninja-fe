import { MultivariateRenderer } from '../MultivariateRenderer/MultivariateRenderer';
import { LAYER_BIVARIATE_PREFIX, SOURCE_BIVARIATE_PREFIX } from './constants';
import { legendToMultivariateStyle, mcdaToMultivariateStyle } from '~utils/bivariate/bivariateToMultivariate';
import type { BivariateLegend } from '~core/logical_layers/types/legends';
import type { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import type { LogicalLayerState } from '~core/logical_layers/types/logicalLayer';
import type { LayerStyle } from '../../types/style';
import type { MultivariateLayerStyle } from '../stylesConfigs/multivariate/multivariateStyle';

export class BivariateRenderer extends MultivariateRenderer {
  protected getSourcePrefix(): string {
    return SOURCE_BIVARIATE_PREFIX;
  }

  protected getClickableLayerId(): string {
    return LAYER_BIVARIATE_PREFIX + this.id;
  }

  private convertStyle(
    legend: BivariateLegend | null,
    style: LayerStyle | null,
  ): MultivariateLayerStyle | null {
    if (style && style.type === 'mcda') {
      return mcdaToMultivariateStyle(style);
    }
    if (legend) {
      return legendToMultivariateStyle(legend);
    }
    return null;
  }

  willSourceUpdate({ map, state }: { map: ApplicationMap; state: LogicalLayerState }): void {
    const legend = state.legend as BivariateLegend | null;
    const style = state.style as LayerStyle | null;
    const converted = this.convertStyle(legend, style);
    super.willSourceUpdate({ map, state: { ...state, style: converted } });
  }

  willMount({ map, state }: { map: ApplicationMap; state: LogicalLayerState }): void {
    const legend = state.legend as BivariateLegend | null;
    const style = state.style as LayerStyle | null;
    const converted = this.convertStyle(legend, style);
    super.willMount({ map, state: { ...state, style: converted } });
  }
}
