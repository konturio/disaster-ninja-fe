import {
  LayerLegend,
  LogicalLayer,
} from '~core/logical_layers/createLogicalLayerAtom';
import { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import { BivariateLayerStyle } from '~utils/bivariate/bivariateColorThemeUtils';
import { BivariateLegend } from '~core/logical_layers/createLogicalLayerAtom/types';
import { layersOrderManager } from '~core/logical_layers/layersOrder';
import { enabledLayersAtom } from '~core/shared_state';

export class BivariateLayer implements LogicalLayer {
  public readonly id: string;
  public readonly name: string;
  public readonly group = 'bivariate';
  public readonly category = 'overlay';
  public readonly legend: LayerLegend;
  private readonly _layerStyle: BivariateLayerStyle;

  private _isMounted = false;

  public constructor({
    name,
    id,
    layerStyle,
    legend,
  }: {
    name: string;
    id: string;
    layerStyle: BivariateLayerStyle;
    legend: BivariateLegend;
  }) {
    this.name = name;
    this.id = id;
    this._layerStyle = layerStyle;
    this.legend = legend;
  }

  get isMounted(): boolean {
    return this._isMounted;
  }

  onInit() {
    return { isVisible: true, isLoading: false };
  }

  public willEnabled(map?: ApplicationMap) {
    return [enabledLayersAtom.add(this.id)];
  }

  public willDisabled(map?: ApplicationMap) {
    return [enabledLayersAtom.remove(this.id)];
  }

  willMount(map: ApplicationMap) {
    if (map.getLayer(this._layerStyle.id) !== undefined) {
      map.setLayoutProperty(this._layerStyle.id, 'visibility', 'visible');
    } else {
      const beforeId = layersOrderManager.getBeforeIdByType(
        this._layerStyle.type as any,
      );
      map.addLayer(this._layerStyle as any, beforeId);
    }
    this._isMounted = true;
    return this.legend;
  }

  willUnmount(map: ApplicationMap) {
    if (map.getLayer(this._layerStyle.id) !== undefined) {
      map.setLayoutProperty(this._layerStyle.id, 'visibility', 'none');
    }
    this._isMounted = false;
  }

  willHide(map: ApplicationMap) {
    if (map.getLayer(this._layerStyle.id) !== undefined) {
      map.setLayoutProperty(this._layerStyle.id, 'visibility', 'none');
    }
  }

  willUnhide(map: ApplicationMap) {
    if (map.getLayer(this._layerStyle.id) !== undefined) {
      map.setLayoutProperty(this._layerStyle.id, 'visibility', 'visible');
    }
  }

  onDataChange() {
    // noop
  }
}
