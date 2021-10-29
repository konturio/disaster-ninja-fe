import { IMapLogicalLayer } from '~core/shared_state/mapLogicalLayersAtom';
import {
  ApplicationLayer,
  ApplicationMap,
} from '~components/ConnectedMap/ConnectedMap';

export type MountableLayerConfig = ApplicationLayer & { name?: string };

export class MountableLayer implements IMapLogicalLayer {
  private readonly _layerConfig: ApplicationLayer;
  public readonly id: string;
  public readonly name?: string;
  private _isMounted = false;

  public constructor({ name, ...layerConfig }: MountableLayerConfig) {
    this.id = layerConfig.id;
    if (name) {
      this.name = name;
    }
    this._layerConfig = layerConfig;
  }

  get isMounted(): boolean {
    return this._isMounted;
  }

  public onMount(map: ApplicationMap): void {
    if (map.getLayer(this.id)) {
      throw new Error('Layer with such id is already added to map');
    }

    map.addLayer(this._layerConfig);
    this._isMounted = true;
  }

  public onUnmount(map: ApplicationMap): void {
    if (map.getLayer(this.id)) {
      map.removeLayer(this.id);
    }
    this._isMounted = false;
  }
}
