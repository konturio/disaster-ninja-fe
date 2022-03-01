import { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import { MapboxLayer } from '@deck.gl/mapbox';
import { createDrawingLayers, drawModes, DrawModeType } from '../constants';
import { layersConfigs } from '../configs';
import { FeatureCollection, Feature } from 'geojson';
import { setMapInteractivity } from '~utils/map/setMapInteractivity';
import { registerMapListener } from '~core/shared_state/mapListeners';
import { TranslationService as i18n } from '~core/localization';
import gpsi from 'geojson-polygon-self-intersections';
import { LogicalLayerDefaultRenderer } from '~core/logical_layers/renderers/DefaultRenderer';
import {
  NotNullableMap,
  CommonHookArgs,
} from '~core/logical_layers/types/renderer';
import { CombinedAtom } from '../atoms/combinedAtom';
import { NotificationType } from '~core/shared_state/currentNotifications';
import { NotificationMessage } from '~core/types/notification';

type mountedDeckLayersType = {
  [key in DrawModeType]?: MapboxLayer<unknown>;
};
const completedTypes = [
  'selectFeature',
  'addPosition',
  'removePosition',
  'finishMovePosition',
  'rotated',
  'translated',
  'scaled',
];

export class DrawModeRenderer extends LogicalLayerDefaultRenderer<CombinedAtom> {
  public readonly id: string;
  public readonly name?: string;
  public mode?: DrawModeType;
  public mountedDeckLayers: mountedDeckLayersType;
  public drawnData: FeatureCollection;
  public selectedIndexes: number[] = [];
  private _map!: ApplicationMap;
  private _createDrawingLayer: DrawModeType | null;
  private _editDrawingLayer: DrawModeType | null;
  private _removeClickListener: null | (() => void) = null;
  private _previousValidGeometry: FeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  };
  // actions
  private _setFeaturesAction: (features: Feature[]) => void = () =>
    console.error('setFeatures action isn`t availible yet');
  private _addFeatureAction: (feature: Feature) => void = () =>
    console.error('addFeature action isn`t availible yet');
  private _updateTempFeaturesAction: (
    features: Feature[],
    updateIndexes: number[],
  ) => void = () =>
    console.error('updateTempFeatures action isn`t availible yet');
  private _showNotificationAction: (
    type: NotificationType,
    message: NotificationMessage,
    lifetimeSec: number,
  ) => void = () =>
    console.error('showNotification action isn`t availible yet');

  private _setSelectedIndexes: (indexes: number[]) => void = () =>
    console.error('setIndexes action isn`t availible yet');
  private _setDrawingStarted: (isStarted: boolean) => void = () =>
    console.error('setDrawingStarting action isn`t availible yet');
  // hooks

  public constructor(id: string, name?: string) {
    super();
    this.id = id;
    this.mountedDeckLayers = {};
    this.drawnData = {
      features: [],
      type: 'FeatureCollection',
    };
    if (name) {
      this.name = name;
    }
    this._createDrawingLayer = null;
    this._editDrawingLayer = null;
  }

  willMount(args: NotNullableMap & CommonHookArgs): void {
    this._map = args.map;
  }

  willUnMount(args: NotNullableMap & CommonHookArgs): void {
    this._setDrawingStarted(false);
    this._removeAllDeckLayers(args.map);
    this._removeClickListener?.();
  }

  willHide(args: NotNullableMap & CommonHookArgs): void {
    this._removeAllDeckLayers(args.map);
  }

  setupExtension(extentionAtom: CombinedAtom): void {
    this._setFeaturesAction = (features) =>
      extentionAtom.setFeatures.dispatch(features);
    this._addFeatureAction = (feature) =>
      extentionAtom.addFeature.dispatch(feature);
    extentionAtom.hookWithAtom.dispatch([
      'drawnGeometryAtom',
      (featureCollection) => {
        this._previousValidGeometry = featureCollection;
        this._updateData(featureCollection);
      },
    ]);
    this._updateTempFeaturesAction = (features, indexes) =>
      extentionAtom.updateTempFeatures.dispatch(features, indexes);
    extentionAtom.hookWithAtom.dispatch([
      'temporaryGeometryAtom',
      (featureCollection) => {
        // temporary geometry clears out after every deletion of any amount of features
        // if we cleared temporaryGeometry, there's no need to clear all displayed geometry (geometry from drawnGeometryAtom)
        if (featureCollection.features.length)
          this._updateData(featureCollection);
      },
    ]);
    this._setSelectedIndexes = (indexes) =>
      extentionAtom.setIndexes.dispatch(indexes);
    extentionAtom.hookWithAtom.dispatch([
      'selectedIndexesAtom',
      (indexes) => (this.selectedIndexes = [...indexes]),
    ]);

    this._setDrawingStarted = (isStarted) =>
      extentionAtom.setDrawingIsStarted.dispatch(isStarted);

    this._showNotificationAction = (type, message, lifetimeSec) =>
      extentionAtom.showNotification.dispatch(type, message, lifetimeSec);
  }

  // Public methods

  public setMode(mode: DrawModeType): any {
    this.mode = mode;
    // Case setting mode to create drawings
    if (createDrawingLayers.includes(mode)) {
      this._map.doubleClickZoom.disable();
      // if we had other drawing mode - remove it
      if (this._createDrawingLayer && this._createDrawingLayer !== mode)
        this._removeDeckLayer(this._createDrawingLayer);
      this._addDeckLayer(drawModes[mode]);
      this._createDrawingLayer = mode;
    }
    // Case editing - remove create-drawing modes, add modify and icon showing modes
    else {
      // Case switched from create drawig mode - remove create-drawing modes
      if (this._createDrawingLayer) {
        this._removeDeckLayer(this._createDrawingLayer);
        this._createDrawingLayer = null;
        this._map.doubleClickZoom.enable();
      }
      if (this._editDrawingLayer === mode) return;
      this._addDeckLayer(drawModes[mode]);
      this._editDrawingLayer = mode;
    }
  }

  public addClickListener() {
    function listener(e) {
      e.preventDefault();
      return false;
    }
    this._removeClickListener = registerMapListener('click', listener, 10);
  }

  // Private methods

  _addDeckLayer(mode: DrawModeType): void {
    if (this.mountedDeckLayers[mode])
      return console.error(`cannot add ${mode} as it's already mounted`);
    const config = layersConfigs[mode];
    // Types for data are wrong. See https://deck.gl/docs/api-reference/layers/geojson-layer#data
    if (mode === drawModes.ModifyMode) {
      config.data = this.drawnData;
      config.selectedFeatureIndexes = this.selectedIndexes;
      config.onEdit = this._onModifyEdit;
      config.getEditHandleIcon = (d) => {
        if (
          d.properties.editHandleType === 'scale' ||
          d.properties.editHandleType === 'rotate'
        )
          return 'pointIcon';
        if (!('featureIndex' in d.properties)) return null;
        const featureToHandle =
          this.drawnData.features[d.properties.featureIndex];
        if (featureToHandle.geometry.type !== 'Point') return 'pointIcon';
        return 'selectedIcon';
      };
      config.getEditHandleIconSize = (d) => {
        if (!('featureIndex' in d.properties)) return 1.8;
        const featureToHandle =
          this.drawnData.features[d.properties.featureIndex];
        if (featureToHandle.geometry.type !== 'Point') return 1.8;
        return 6;
      };
      config.geojsonIcons.getIcon = (d) => {
        if (!d.properties || d.properties.isHidden) return null;
        if (d.properties.isSelected) return 'selectedIcon';
        return 'defaultIcon';
      };
    } else if (createDrawingLayers.includes(mode)) {
      config.onEdit = this._onDrawEdit;
    }
    config._subLayerProps.guides.pointRadiusMinPixels = 4;
    config._subLayerProps.guides.pointRadiusMaxPixels = 4;
    const deckLayer = new MapboxLayer({ ...config });
    if (!this._map.getLayer(deckLayer.id)?.id) this._map.addLayer?.(deckLayer);
    this.mountedDeckLayers[mode] = deckLayer;
  }

  _removeDeckLayer(mode: DrawModeType): void {
    const deckLayer = this.mountedDeckLayers[mode];
    if (!deckLayer)
      return console.error(`cannot remove ${mode} as it wasn't mounted`);
    this._map.removeLayer(deckLayer.id);
    delete this.mountedDeckLayers[mode];
  }

  private _removeAllDeckLayers(map: ApplicationMap) {
    map.doubleClickZoom.enable();
    this._setSelectedIndexes([]);
    const keys = Object.keys(this.mountedDeckLayers) as DrawModeType[];
    keys.forEach((deckLayer) => this._removeDeckLayer(deckLayer));
    this._createDrawingLayer = null;
    this._editDrawingLayer = null;
    this._removeClickListener?.();
  }

  _updateData(data: FeatureCollection) {
    if (!this._map) return;

    this.drawnData = data;
    this._refreshMode(drawModes.ModifyMode);
  }

  _refreshMode(mode: DrawModeType): void {
    const layer = this.mountedDeckLayers[mode];
    layer?.setProps({
      data: this.drawnData,
      selectedFeatureIndexes: this.selectedIndexes,
    });
  }

  _onModifyEdit = ({ editContext, updatedData, editType }) => {
    const changedIndexes: number[] = editContext?.featureIndexes || [];
    this._setSelectedIndexes(changedIndexes);
    // edit types list availible here in the description of onEdit method https://nebula.gl/docs/api-reference/layers/editable-geojson-layer
    if (editType === 'selectFeature' && this._createDrawingLayer) {
      this._setSelectedIndexes([]);
    } else if (editType === 'removeFeature') {
      this._setFeaturesAction(updatedData.features);
    } else if (updatedData.features?.[0] && completedTypes.includes(editType)) {
      // make map interactive if we finished drawing
      setMapInteractivity(this._map, true);
      for (let i = 0; i < updatedData.features.length; i++) {
        const feature = updatedData.features[i];
        if (changedIndexes.includes(i)) {
          feature.properties.isSelected = true;
          // check each edited feature for intersections
          if (hasIntersections(feature)) {
            this._showNotificationAction(
              'error',
              { title: i18n.t('Polygon should not overlap itself') },
              5,
            );
            return this._updateData(this._previousValidGeometry);
          }
        } else {
          // remove edit coloring for all of them
          delete feature.properties.temporary;
          delete feature.properties.isSelected;
        }
      }
      this._setFeaturesAction(updatedData.features);
      // temporaryGeometryAtom.resetToDefault.dispatch()
    } else if (updatedData.features?.[0]) {
      // Case we're in process of modifying features that could be not validated yet
      setMapInteractivity(this._map, false);
      this._updateTempFeaturesAction(updatedData.features, changedIndexes);
    } else {
      this._setFeaturesAction(updatedData.features);
    }
  };

  _onDrawEdit = ({ editContext, updatedData, editType }) => {
    if (editType === 'addTentativePosition' || editType === 'addFeature')
      this._setDrawingStarted(true);
    if (editType === 'addFeature' && updatedData.features[0])
      this._addFeatureAction(updatedData.features[0]);
  };
}

function hasIntersections(feature: Feature) {
  if (feature.geometry.type === 'MultiPolygon') {
    for (let i = 0; i < feature.geometry.coordinates.length; i++) {
      const polygonFeature: Feature = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: feature.geometry.coordinates[i],
        },
        properties: {},
      };
      if (hasIntersections(polygonFeature)) return true;
    }
  }
  if (feature.geometry.type !== 'Polygon') return false;
  const intersectionFeature = gpsi(feature);
  if (intersectionFeature.geometry.coordinates.length) return true;
}
