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
  public isMounted: boolean;

  public constructor({ name, ...layerConfig }: MountableLayerConfig) {
    this.id = layerConfig.id;
    if (name) {
      this.name = name;
    }
    this._layerConfig = layerConfig;
  }

  public mount(map: ApplicationMap): void {
    if (map.getLayer(this.id)) {
      throw new Error('Layer with such id is already added to map');
    }

    map.addLayer(this._layerConfig);
    this.isMounted = true;
  }

  public unmount(map: ApplicationMap): void {
    if (map.getLayer(this.id)) {
      map.removeLayer(this.id);
    }
    this.isMounted = false;
  }
}
