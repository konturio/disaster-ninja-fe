import { LogicalLayer } from '~utils/atoms/createLogicalLayerAtom';
import { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import { BivariateLayerStyle } from '~utils/bivariate/bivariateColorThemeUtils';
import { BivariateLegend } from '~utils/atoms/createLogicalLayerAtom/legend';
import { legendPanelAtom } from '~features/legend_panel/atoms/legendPanel';

export class BivariateLayer implements LogicalLayer {
  public readonly id: string;
  public readonly name: string;
  public readonly group = 'bivariate';
  private readonly _legend: BivariateLegend;
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
  }

  get isMounted(): boolean {
    return this._isMounted;
  }

  onInit() {
    return { isVisible: true, isLoading: false, isListed: true };
  }

  willMount(map: ApplicationMap) {
    if (map.getLayer(this.id) !== undefined) {
      map.setLayoutProperty(this.id, 'visibility', 'visible');
    } else {
      map.addLayer(this._layerStyle as any);
    }
    legendPanelAtom.addLegend.dispatch(this._legend);
    this._isMounted = true;
  }

  willUnmount(map: ApplicationMap) {
    map.setLayoutProperty(this.id, 'visibility', 'none');
    legendPanelAtom.removeLegend.dispatch(this._legend.name);
    this._isMounted = false;
  }
}
