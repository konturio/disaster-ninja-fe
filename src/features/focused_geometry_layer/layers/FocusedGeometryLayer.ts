import { LayerLegend, LogicalLayer } from '~utils/atoms/createLogicalLayerAtom';
import { FocusedGeometry } from '~core/shared_state/focusedGeometry';
import { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import { notificationService } from '~core/index';
import { GeoJSONSource } from 'maplibre-gl';
import { layersOrderManager } from '~core/layersOrder';

const layersConfig = (id: string, sourceId: string): maplibregl.AnyLayer[] => [
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
];

export class FocusedGeometryLayer
  implements LogicalLayer<FocusedGeometry | null>
{
  public readonly id: string;
  public readonly name?: string;
  public readonly legend?: LayerLegend;

  private _sourceId: string;
  private _lastGeometryUpdate: GeoJSON.Feature | GeoJSON.FeatureCollection;

  constructor({ id, name }) {
    this.id = id;
    this.name = name;
    this._sourceId = `${id}-source`;
    this._lastGeometryUpdate = {
      type: 'FeatureCollection',
      features: [],
    };
  }

  onInit() {
    return { isLoading: false, isVisible: true, isListed: true };
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

    layersConfig(this.id + '-layer', this._sourceId).forEach((layerConfig) => {
      const beforeId = layersOrderManager.getBeforeIdByType(layerConfig.type);
      map.addLayer(layerConfig, beforeId);
    });
  }

  onDataChange(map: ApplicationMap, data: FocusedGeometry | null) {
    if (data === null) {
      this._lastGeometryUpdate = {
        type: 'FeatureCollection',
        features: [],
      };
    } else {
      const geojson = { ...data.geometry };
      if (geojson.type === 'Feature' || geojson.type === 'FeatureCollection') {
        this._lastGeometryUpdate = geojson;
      } else {
        // TODO: Add converter from any GeoJSON to Feature or FeatureCollection
        notificationService.error({
          title: 'Not implemented yet',
          description: `${geojson.type} not supported`,
        });
      }
    }

    const source = map.getSource(this._sourceId);
    if (source) {
      (source as GeoJSONSource).setData(this._lastGeometryUpdate);
    }
  }

  willUnmount(map: ApplicationMap) {
    layersConfig(this.id + '-layer', this._sourceId).forEach((layerConfig) => {
      map.removeLayer(layerConfig.id);
    });
    map.removeSource(this._sourceId);
  }
}
