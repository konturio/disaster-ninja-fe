import { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import { MapboxLayer } from '@deck.gl/mapbox';
import { LogicalLayer } from '~utils/atoms/createLogicalLayerAtom';
import { layersOrderManager } from '~core/layersOrder';
import { drawModes, DrawModeType } from '../constants';
import { layersConfigs } from '../configs';
import { MapboxLayerProps } from '@deck.gl/mapbox/mapbox-layer';
import { FeatureCollection } from 'geojson';
import { ViewMode } from '@nebula.gl/edit-modes';
import { drawnGeometryAtom } from '../atoms/drawnGeometryAtom';




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
    // this.drawnData = drawnGeometryAtom.getState()
  }

  willUnmount(): void {
    this.willHide()
    this._isMounted = false;
  }

  // on logic layer mount - add watch/edit deck layer mode
  addDeckLayer(type: DrawModeType): void {
    if (this.mountedDeckLayers[type]) return console.log(`cannot add ${type} as it's already mounted`);

    const config: MapboxLayerProps<unknown> = layersConfigs[type]
    if (type === drawModes.ViewMode) config.data = this.drawnData
    console.log('%c⧭ config from adding', 'color: #1d3f73', this.drawnData.features);
    const deckLayer = new MapboxLayer({ ...config, renderingMode: '2d' })
    const beforeId = layersOrderManager.getBeforeIdByType(deckLayer.type);

    if (!this._map?.getLayer(deckLayer.id)?.id)
      this._map?.addLayer?.(deckLayer, beforeId);

    this.mountedDeckLayers[type] = deckLayer
  }

  removeDeckLayer(type: DrawModeType): void {
    const deckLayer = this.mountedDeckLayers[type]
    if (!deckLayer) return console.log(`cannot remove ${type} as it wasn't mounted`);

    this._map.removeLayer(deckLayer.id)
    delete this.mountedDeckLayers[type]
  }


  onDataChange(map: ApplicationMap, data: FeatureCollection | null) {
    // console.log('%c⧭ data change fired', 'color: #00a3cc', data);
  }

  updateViewData(data: FeatureCollection) {
    if (!this._map) return;
    this.drawnData = data
    // const { implementation } = this._map.getLayer(drawModes.ViewMode)
    // implementation.deck.setProps
    this.removeDeckLayer(drawModes.ViewMode)
    this.addDeckLayer(drawModes.ViewMode)
  }

  willHide() {
    const keys = Object.keys(this.mountedDeckLayers) as DrawModeType[]
    keys.forEach(deckLayer => this.removeDeckLayer(deckLayer))
  }
  willUnhide() {

  }
}
