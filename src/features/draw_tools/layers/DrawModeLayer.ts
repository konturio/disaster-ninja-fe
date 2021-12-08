import { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import { MapboxLayer } from '@deck.gl/mapbox';
import { LogicalLayer } from '~utils/atoms/createLogicalLayerAtom';
import { layersOrderManager } from '~core/layersOrder';
import { createDrawingLayers, drawModes, DrawModeType, editDrawingLayers } from '../constants';
import { layersConfigs } from '../configs';
import { MapboxLayerProps } from '@deck.gl/mapbox/mapbox-layer';
import { FeatureCollection } from 'geojson';
import { ViewMode } from '@nebula.gl/edit-modes';
import { drawnGeometryAtom } from '../atoms/drawnGeometryAtom';
import { activeDrawModeAtom } from '../atoms/activeDrawMode';
import { currentMapAtom } from '~core/shared_state';


type mountedDeckLayersType = {
  [key in DrawModeType]?: MapboxLayer<unknown>
}
const completedTypes = ['selectFeature', 'finishMovePosition', 'rotated', 'translated']

export class DrawModeLayer implements LogicalLayer {
  public readonly id: string;
  public readonly name?: string;
  public mode?: DrawModeType
  public mountedDeckLayers: mountedDeckLayersType
  public drawnData: FeatureCollection
  private _isMounted = false;
  private _map!: ApplicationMap
  private _createDrawingLayer: DrawModeType | null
  private _editDrawingLayer: DrawModeType | null
  public selectedIndexes: number[] = [1]
  public test: any

  public constructor(id: string, name?: string) {
    this.id = id;
    this.mountedDeckLayers = {}
    this.drawnData = {
      features: [], type: 'FeatureCollection'
    }
    if (name) {
      this.name = name;
    }
    this._createDrawingLayer = null
    this._editDrawingLayer = null
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

  setMode(mode: DrawModeType): void {
    this.mode = mode
    if (!mode) return this.willHide()
    // Case setting mode to create drawings - 
    if (createDrawingLayers.includes(mode)) {
      // Make shure editing mode is Modify mode
      if (!this._editDrawingLayer) this._addDeckLayer(drawModes.ModifyMode)
      else if (this._editDrawingLayer !== drawModes.ModifyMode) {
        this._removeDeckLayer(this._editDrawingLayer)
        this._addDeckLayer(drawModes.ModifyMode)
      }
      this._editDrawingLayer = drawModes.ModifyMode

      this._addDeckLayer(drawModes[mode])
      this._createDrawingLayer = mode
    }

    // Case setting editing mode - remove drawing mode and update edit mode if needed
    else if (editDrawingLayers.includes(mode)) {
      if (this._createDrawingLayer) {
        this._removeDeckLayer(this._createDrawingLayer)
        this._createDrawingLayer = null
      }
      if (this._editDrawingLayer === mode) return;
      if (this._editDrawingLayer && this._editDrawingLayer !== mode) this._removeDeckLayer(this._editDrawingLayer);
      this._addDeckLayer(drawModes[mode])
      this._editDrawingLayer = mode
    }
  }

  _addDeckLayer(mode: DrawModeType): void {
    if (this.mountedDeckLayers[mode]) return console.log(`cannot add ${mode} as it's already mounted`);

    console.log('%c⧭ layer added: ', 'color: #7f7700', mode);
    const config: MapboxLayerProps<unknown> = layersConfigs[mode]
    // Types for data are wrong. See https://deck.gl/docs/api-reference/layers/geojson-layer#data
    if (editDrawingLayers.includes(mode)) {
      // config.selectedFeatureIndexes = [...this.selectedIndexes]
      config.data = this.drawnData
      config.selectedFeatureIndexes = this.selectedIndexes
    }
    if (mode === drawModes.ModifyMode) config.onEdit = this._onModifyEdit

    console.log('%c⧭ config from adding', 'color: #1d3f73', this.drawnData.features);
    const deckLayer = new MapboxLayer({ ...config, renderingMode: '2d' })
    const beforeId = layersOrderManager.getBeforeIdByType(deckLayer.type);

    if (!this._map?.getLayer(deckLayer.id)?.id)
      this._map?.addLayer?.(deckLayer, beforeId);

    this.mountedDeckLayers[mode] = deckLayer
  }

  _removeDeckLayer(mode: DrawModeType): void {
    const deckLayer = this.mountedDeckLayers[mode]
    if (!deckLayer) return console.log(`cannot remove ${mode} as it wasn't mounted`);

    this._map.removeLayer(deckLayer.id)
    delete this.mountedDeckLayers[mode]
  }


  onDataChange(map: ApplicationMap, data: FeatureCollection | null) {
    // console.log('%c⧭ data change fired', 'color: #00a3cc', data);
  }

  updateData(data: FeatureCollection) {
    if (!this._map) return;
    this.drawnData = data
    this._refreshMode(drawModes.ModifyMode)
  }


  _refreshMode(mode: DrawModeType): void {
    const layer = this.mountedDeckLayers[mode]
    console.log('%c⧭ layer1', 'color: #00e600', layer, layer?.deck.props.data);
    // this won't show anything
    // layer?.deck.setProps({ data: this.drawnData })
    layer?.setProps({ data: this.drawnData, selectedFeatureIndexes: this.selectedIndexes })
    console.log('%c⧭ layer2', 'color: #00e600', layer?.deck.props.data);
  }

  willHide() {
    const keys = Object.keys(this.mountedDeckLayers) as DrawModeType[]
    keys.forEach(deckLayer => this._removeDeckLayer(deckLayer))
    this._createDrawingLayer = null
    this._editDrawingLayer = null
  }

  willUnhide() {

  }

  _onModifyEdit = ({ editContext, updatedData, editType }) => {
    console.log('%c⧭', 'color: #e50000', editContext.featureIndexes);
    this.selectedIndexes = editContext.featureIndexes

    // if we selected something being in draw modes
    if (this._createDrawingLayer && editContext.featureIndexes.length) {
      activeDrawModeAtom.setDrawMode.dispatch(drawModes.ModifyMode)
    }

    if (updatedData.features?.[0] && completedTypes.includes(editType)) {
      drawnGeometryAtom.updateFeature.dispatch(editContext.featureIndexes[0], updatedData.features[0])
      currentMapAtom.setInteractivity.dispatch(true)
    } else if (updatedData.features?.[0]) {
      drawnGeometryAtom.updateFeature.dispatch(editContext.featureIndexes[0], updatedData.features[0])
      currentMapAtom.setInteractivity.dispatch(false)
    }
  }
}

function arraysAreEqual(arr1: number[], arr2: number[]): boolean {
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false
  }
  return true
}