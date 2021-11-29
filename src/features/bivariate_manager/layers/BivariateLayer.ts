import { LogicalLayer } from '~utils/atoms/createLogicalLayerAtom';
import { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import { BivariateLayerStyle } from '~utils/bivariate/bivariateColorThemeUtils';
import { BivariateLegend } from '~utils/atoms/createLogicalLayerAtom/legend';
import { layersOrderManager } from '~core/layersOrder';

export class BivariateLayer implements LogicalLayer {
  public readonly id: string;
  public readonly name: string;
  public readonly group = 'bivariate';
  private readonly _legend: BivariateLegend;
  readonly legend!: BivariateLegend;
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
    this._legend = legend;
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
        this._layerStyle.type,
      );
      map.addLayer(this._layerStyle as any, beforeId);
    }
    this._isMounted = true;
  }

  willUnmount(map: ApplicationMap) {
    map.setLayoutProperty(this.id, 'visibility', 'none');
    this._isMounted = false;
  }
}
