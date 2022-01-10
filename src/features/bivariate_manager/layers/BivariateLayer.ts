import { LayerLegend, LogicalLayer } from '~core/logical_layers/createLogicalLayerAtom';
import { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import { BivariateLayerStyle } from '~utils/bivariate/bivariateColorThemeUtils';
import { BivariateLegend } from '~core/logical_layers/createLogicalLayerAtom/types';
import { layersOrderManager } from '~core/logical_layers/layersOrder';

export class BivariateLayer implements LogicalLayer {
  public readonly id: string;
  public readonly name: string;
  public readonly group = 'bivariate';
  public readonly category = 'overlay';
  public readonly legend: LayerLegend;
  private readonly _layerStyle: BivariateLayerStyle;

  private _isMounted = false;

  public constructor(
    name: string,
    layerStyle: BivariateLayerStyle,
    legend: BivariateLegend,
  ) {
    this.name = name;
    this.id = layerStyle.id;
    this._layerStyle = layerStyle;
    this.legend = legend;
  }

  get isMounted(): boolean {
    return this._isMounted;
  }

  onInit() {
    return { isVisible: true, isLoading: false };
  }

  willMount(map: ApplicationMap) {
    if (map.getLayer(this.id) !== undefined) {
      map.setLayoutProperty(this.id, 'visibility', 'visible');
    } else {
      const beforeId = layersOrderManager.getBeforeIdByType(
        this._layerStyle.type as any,
      );
      map.addLayer(this._layerStyle as any, beforeId);
    }
    this._isMounted = true;
  }

  willUnmount(map: ApplicationMap) {
    if (map.getLayer(this.id) !== undefined) {
      map.setLayoutProperty(this.id, 'visibility', 'none');
    }
    this._isMounted = false;
  }
}
