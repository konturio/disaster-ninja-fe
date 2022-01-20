import {
  LayerLegend,
  LogicalLayer,
} from '~core/logical_layers/createLogicalLayerAtom';
import { FocusedGeometry } from '~core/shared_state/focusedGeometry';
import { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import { notificationService } from '~core/index';
import { GeoJSONSource } from 'maplibre-gl';
import { layersOrderManager } from '~core/logical_layers/layersOrder';
import { IconLayer } from '@deck.gl/layers';
import { MapboxLayer } from '@deck.gl/mapbox';
import Icon from '../icons/iconAtlas.png';
import app_config from '~core/app_config';
import { downloadObject } from '~utils/fileHelpers/download';

const getLayersConfig = (
  id: string,
  sourceId: string,
  data: any,
): maplibregl.AnyLayer[] => [
  {
    id: id + '-main',
    source: sourceId,
    type: 'line' as const,
    paint: {
      'line-width': 6,
      'line-color': '#0C9BED',
    },
    layout: {
      'line-join': 'round',
    },
  },
  {
    id: id + '-outline',
    source: sourceId,
    type: 'line' as const,
    paint: {
      'line-width': 8,
      'line-color': '#FFF',
      'line-opacity': 0.5,
    },
    layout: {
      'line-join': 'round',
    },
  },
  new MapboxLayer({
    id: id + '-icons',
    type: IconLayer,
    // @ts-ignore: types are wrong. MapboxLayer constructor doesn't expect specific IconLayer props
    iconAtlas: Icon,
    iconMapping: app_config.iconLayer.iconMapping,
    // required to show data
    getIcon: (d) => {
      if (d.isHidden) return null;
      if (d.isSelected) return 'selectedIcon';
      return 'defaultIcon';
    },
    getPosition: (d) => d.coordinates,

    sizeScale: app_config.iconLayer.sizeScale,
    getSize: app_config.iconLayer.getSize,

    pickable: true,
    data,
  }),
];

// const deckLayer = new MapboxLayer({ id: id + '-icons' })

export class FocusedGeometryLayer
  implements LogicalLayer<FocusedGeometry | null>
{
  public readonly id: string;
  public readonly name?: string;
  public readonly legend?: LayerLegend;
  private _sourceId: string;
  private _lastGeometryUpdate: GeoJSON.Feature | GeoJSON.FeatureCollection;
  private _iconLayerData: {
    [key: string]: any;
    coordinates: number[];
  }[];
  private _layerConfigs: maplibregl.AnyLayer[] = [];
  public isDownloadable: boolean = true

  constructor({ id, name }) {
    this.id = id;
    this.name = name;
    this._sourceId = `${id}-source`;
    this._lastGeometryUpdate = {
      type: 'FeatureCollection',
      features: [],
    };
    this._iconLayerData = [];
  }

  onInit() {
    this._layerConfigs = getLayersConfig(
      this.id + '-layer',
      this._sourceId,
      this._iconLayerData,
    );
    return { isLoading: false, isVisible: true };
  }

  wasAddInRegistry() {
    /* noop */
  }

  willMount(map: ApplicationMap) {
    if (import.meta.env.DEV) {
      // HRM fix
      map.getSource(this._sourceId) && this.willUnmount(map);
    }

    map.addSource(this._sourceId, {
      type: 'geojson',
      data: this._lastGeometryUpdate,
    });

    this._layerConfigs.forEach((layerConfig) => {
      const beforeId = layersOrderManager.getBeforeIdByType(layerConfig.type);
      // give data to icons
      map.addLayer(
        layerConfig,
        layerConfig.id.endsWith('-icons') ? null : beforeId,
      );
    });
  }

  onDataChange(map: ApplicationMap | null, data: FocusedGeometry | null) {
    if (data === null) {
      this._lastGeometryUpdate = {
        type: 'FeatureCollection',
        features: [],
      };
      this._iconLayerData = [];
    } else {
      const geojson = { ...data.geometry };

      // Fill data for icon points. We only need points to show data
      if (geojson.type === 'Feature') {
        if (geojson.geometry.type === 'Point') {
          this._iconLayerData = [{ ...geojson.geometry }];
        }
        this._lastGeometryUpdate = geojson;
      } else if (geojson.type === 'FeatureCollection') {
        this._iconLayerData = [];
        geojson.features.forEach((feature) => {
          if (feature.geometry.type === 'Point') {
            this._iconLayerData = [...this._iconLayerData, feature.geometry];
          } else if (feature.geometry.type === 'MultiPoint') {
            feature.geometry.coordinates.forEach(
              (coordinates) =>
                (this._iconLayerData = [
                  ...this._iconLayerData,
                  { coordinates },
                ]),
            );
          }
        });
        this._lastGeometryUpdate = geojson;
      } else {
        // TODO: Add converter from any GeoJSON to Feature or FeatureCollection
        notificationService.error({
          title: 'Not implemented yet',
          description: `${geojson.type} not supported`,
        });
      }
    }

    if (map) {
      const source = map.getSource(this._sourceId);
      if (source) {
        (source as GeoJSONSource).setData(this._lastGeometryUpdate);
      }
      const iconLayer = map.getLayer(this.id + '-layer' + '-icons');
      // custom layer has .implementation key which leads to Mapbox deak layer created with new Mapboxlayer()
      iconLayer &&
        (iconLayer as any).implementation?.setProps({
          data: this._iconLayerData,
        });
    }
  }

  willUnmount(map: ApplicationMap) {
    this._layerConfigs.forEach(({ id }) => {
      map.removeLayer(id);
    });
    map.removeSource(this._sourceId);
  }

  willHide(map: ApplicationMap) {
    this._layerConfigs.forEach(({ id }) => {
      map.setLayoutProperty(id, 'visibility', 'none');
    });
  }

  willUnhide(map: ApplicationMap) {
    this._layerConfigs.forEach(({ id }) => {
      map.setLayoutProperty(id, 'visibility', 'visible');
    });
  }
  
  public onDownload(map: ApplicationMap) {
    downloadObject(this._lastGeometryUpdate, `${this.name || 'Disaster Ninja map layer'} ${new Date().toISOString()}.json`)
  }
}
