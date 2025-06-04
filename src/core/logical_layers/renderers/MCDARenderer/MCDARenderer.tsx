import { MultivariateRenderer } from '../MultivariateRenderer/MultivariateRenderer';
import { mcdaToMultivariateStyle } from '~utils/bivariate/bivariateToMultivariate';
import type { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import type { LogicalLayerState } from '~core/logical_layers/types/logicalLayer';
import type { MCDALayerStyle } from '../stylesConfigs/mcda/types';
import type { MultivariateLayerStyle } from '../stylesConfigs/multivariate/multivariateStyle';

export class MCDARenderer extends MultivariateRenderer {
  protected getSourcePrefix(): string {
    return 'mcda-source-';
  }

  protected getClickableLayerId(): string {
    return 'mcda-layer-' + this.id;
  }

  private convertStyle(style: MCDALayerStyle | null): MultivariateLayerStyle | null {
    return style ? mcdaToMultivariateStyle(style) : null;
  }

  willSourceUpdate({ map, state }: { map: ApplicationMap; state: LogicalLayerState }): void {
    const style = state.style as MCDALayerStyle | null;
    const converted = this.convertStyle(style);
    super.willSourceUpdate({ map, state: { ...state, style: converted } });
  }

  willMount({ map, state }: { map: ApplicationMap; state: LogicalLayerState }): void {
    const style = state.style as MCDALayerStyle | null;
    const converted = this.convertStyle(style);
    super.willMount({ map, state: { ...state, style: converted } });
  }
}
