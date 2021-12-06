import { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import { MapboxLayer } from '@deck.gl/mapbox';
import { LogicalLayer } from '~utils/atoms/createLogicalLayerAtom';
import { layersOrderManager } from '~core/layersOrder';
import { drawModes, DrawModeType } from '../constants';
import { layersConfigs } from '../configs';
import { MapboxLayerProps } from '@deck.gl/mapbox/mapbox-layer';
import { FeatureCollection } from 'geojson';




type mountedDeckLayersType = {
  [key in DrawModeType]?: MapboxLayer<unknown>
}

export class DrawModeLayer implements LogicalLayer {
  public readonly id: string;
  public readonly name?: string;
  public mountedDeckLayers: mountedDeckLayersType
  public drawnData: FeatureCollection
  private _isMounted = false;
  private _map!: ApplicationMap

  public constructor(id: string, name?: string) {
    this.id = id;
    this.mountedDeckLayers = {}
    this.drawnData = {
      features: [], type: 'FeatureCollection'
    }
    if (name) {
      this.name = name;
    }
  }

  get isMounted(): boolean {
    return this._isMounted;
  }

  public onInit() {
    return { isVisible: false, isLoading: false };
  }

  willMount(map: ApplicationMap): void {
    console.log('%c⧭', 'color: #731d1d', 'mounted');
    this._map = map
    this._isMounted = true;
  }

  willUnmount(): void {
    this.willHide()
    this._isMounted = false;
  }

  // on logic layer mount - add watch/edit deck layer mode
  addDeckLayer(type: DrawModeType): void {
    if (this.mountedDeckLayers[type]) return console.log(`cannot add ${type} as it's already mounted`);

    const config: MapboxLayerProps<unknown> = layersConfigs[type]
    const deckLayer = new MapboxLayer({ ...config, renderingMode: '2d' })
    const beforeId = layersOrderManager.getBeforeIdByType(deckLayer.type);

    if (!this._map.getLayer(deckLayer.id)?.id)
      this._map.addLayer(deckLayer, beforeId);

    this.mountedDeckLayers[type] = deckLayer
  }

  removeDeckLayer(type: DrawModeType): void {
    const deckLayer = this.mountedDeckLayers[type]
    if (!deckLayer) return console.log(`cannot remove ${type} as it wasn't mounted`);

    this._map.removeLayer(deckLayer.id)
    delete this.mountedDeckLayers[type]
  }


  onDataChange(map: ApplicationMap, data: FeatureCollection | null) {
    console.log('%c⧭ data change fired', 'color: #00a3cc', data);
    if (!data) return this.drawnData = { type: 'FeatureCollection', features: [] }
    this.drawnData = data

    const deckLayer = map.getLayer(drawModes.ViewMode)
    // console.log('%c⧭', 'color: #00e600', deckLayer);
  }

  willHide() {
    const keys = Object.keys(this.mountedDeckLayers) as DrawModeType[]
    keys.forEach(deckLayer => this.removeDeckLayer(deckLayer))
  }
  willUnhide() { 

  }
}
