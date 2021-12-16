import { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import { MapboxLayer } from '@deck.gl/mapbox';
import { createDrawingLayers, drawModes, DrawModeType, editDrawingLayers } from '../constants';
import { layersConfigs } from '../configs';
import { FeatureCollection } from 'geojson';
import { drawnGeometryAtom } from '../atoms/drawnGeometryAtom';
import { activeDrawModeAtom } from '../atoms/activeDrawMode';
import { selectedIndexesAtom } from '../atoms/selectedIndexesAtom';
import { LogicalLayer } from '~core/logical_layers/createLogicalLayerAtom';
import { layersOrderManager } from '~core/logical_layers/layersOrder';
import { setMapInteractivity } from '../setMapInteractivity';
import { drawingIsStartedAtom } from '../atoms/drawingIsStartedAtom';


type mountedDeckLayersType = {
  [key in DrawModeType]?: MapboxLayer<unknown>
}
const completedTypes = ['selectFeature', 'finishMovePosition', 'rotated', 'translated', 'scaled']

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
  public selectedIndexes: number[] = []

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
    this._map = map
    this._isMounted = true;
    this._addDeckLayer(drawModes.ShowIcon)
  }

  willUnmount(): void {
    this.willHide()
    this._isMounted = false;
  }

  setMode(mode: DrawModeType): any {
    this.mode = mode
    if (!mode) return this.willHide()
    // Case setting mode to create drawings
    if (createDrawingLayers.includes(mode)) {
      // if we had other drawing mode - remove it
      if (this._createDrawingLayer && this._createDrawingLayer !== mode)
        this._removeDeckLayer(this._createDrawingLayer)

      this._addDeckLayer(drawModes[mode])
      this._createDrawingLayer = mode
    }

    // Case editing - remove create-drawing modes, add modify and icon showing modes
    else {
      // remove create-drawing modes
      if (this._createDrawingLayer) {
        this._removeDeckLayer(this._createDrawingLayer)
        this._createDrawingLayer = null
      }
      if (this._editDrawingLayer === mode) return;
      this._addDeckLayer(drawModes[mode])
      this._addDeckLayer(drawModes.ShowIcon)
      this._editDrawingLayer = mode
    }
  }

  _addDeckLayer(mode: DrawModeType): void {
    if (this.mountedDeckLayers[mode]) return console.log(`cannot add ${mode} as it's already mounted`);

    const config = layersConfigs[mode]
    // Types for data are wrong. See https://deck.gl/docs/api-reference/layers/geojson-layer#data
    if (mode === drawModes.ModifyMode) {
      config.data = this.drawnData
      config.selectedFeatureIndexes = this.selectedIndexes
      config.onEdit = this._onModifyEdit
    } else if (createDrawingLayers.includes(mode)) {
      config.onEdit = this._onDrawEdit
    } else {
      config.data = this.drawnData.features.map(feature => feature.geometry)
    }

    config._subLayerProps.guides.pointRadiusMinPixels = 4
    config._subLayerProps.guides.pointRadiusMaxPixels = 4
    console.log('%c⧭ mode config', 'color: #86bf60', config);

    const deckLayer = new MapboxLayer({ ...config })
    console.log('%c⧭ mode decklayer', 'color: #cc7033', deckLayer);
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


  updateData(data: FeatureCollection) {
    if (!this._map) return;
    this.drawnData = data
    this._refreshMode(drawModes.ModifyMode)
    // show icon needs different data type - see more in it's config page
    const simpleGeometry = this.drawnData.features.map(feature => feature.geometry)
    this._refreshMode(drawModes.ShowIcon, simpleGeometry)
  }


  _refreshMode(mode: DrawModeType, specialData?: any[]): void {
    const layer = this.mountedDeckLayers[mode]
    layer?.setProps({ data: specialData || this.drawnData, selectedFeatureIndexes: this.selectedIndexes })
  }

  willHide(map?: ApplicationMap) {
    if (map && !this._map) this._map = map
    const keys = Object.keys(this.mountedDeckLayers) as DrawModeType[]
    keys.forEach(deckLayer => this._removeDeckLayer(deckLayer))
    this._createDrawingLayer = null
    this._editDrawingLayer = null
  }

  willUnhide() {

  }

  _onModifyEdit = ({ editContext, updatedData, editType }) => {
    let changedIndexes = editContext?.featureIndexes || []

    this.selectedIndexes = changedIndexes
    selectedIndexesAtom.setIndexes.dispatch(changedIndexes)

    // if we selected something being in draw modes
    if (this._createDrawingLayer && editContext.featureIndexes.length) {
      activeDrawModeAtom.setDrawMode.dispatch(drawModes.ModifyMode)
    }


    if (updatedData.features?.[0] && completedTypes.includes(editType)) {
      setMapInteractivity(this._map, true)
    } else if (updatedData.features?.[0]) {
      setMapInteractivity(this._map, false)
    }
    drawnGeometryAtom.updateFeatures.dispatch(updatedData.features)
  }

  _onDrawEdit = ({ editContext, updatedData, editType }) => {
    if (editType === 'addTentativePosition' || editType === 'addFeature') drawingIsStartedAtom.setIsStarted.dispatch(true)
    if (editType === 'addFeature' && updatedData.features[0])
      drawnGeometryAtom.addFeature.dispatch(updatedData.features[0]);
  }

  onDataChange() {
    // no data is incoming here
  }
}