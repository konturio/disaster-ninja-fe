import { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import { LogicalLayer, LayerLegend } from '~utils/atoms/createLogicalLayerAtom';
import { mapCSSToMapBoxProperties } from '~utils/map/mapCSSToMapBoxPropertiesConverter';
import { apiClient } from '~core/index';
import { LAYER_IN_AREA_PREFIX, SOURCE_IN_AREA_PREFIX } from '../constants';
import { LayerInArea, LayerInAreaSource } from '../types';
import {
  FocusedGeometry,
  focusedGeometryAtom,
} from '~core/shared_state/focusedGeometry';
import { currentEventAtom } from '~core/shared_state';
import { AnyLayer } from 'maplibre-gl';

export class GenericLayer implements LogicalLayer {
  public readonly id: string;
  public readonly name?: string;
  public readonly legend?: LayerLegend;
  public readonly category?: string;
  public readonly group?: string;
  public readonly description?: string;
  public readonly copyright?: string;
  public readonly boundaryRequiredForRetrieval: boolean;
  private _layerIds: string[];
  private _sourceId: string;
  private _onClickListener:
    | ((e: { lngLat: { lng: number; lat: number } }) => void)
    | null = null;
  private _focusedGeometry: FocusedGeometry | null = null;
  private _eventId: string | null = null;

  public constructor(layer: LayerInArea) {
    this.id = layer.id;
    this.name = layer.name;
    this.category = layer.category;
    this.group = layer.group;
    this.description = layer.description;
    this.copyright = layer.copyright;
    this.boundaryRequiredForRetrieval = layer.boundaryRequiredForRetrieval;
    this.legend = layer.legend;
    /* private */
    this._layerIds = [];
    this._sourceId = SOURCE_IN_AREA_PREFIX + layer.id;
    if (this.boundaryRequiredForRetrieval) {
      focusedGeometryAtom.subscribe((geom) => {
        this._focusedGeometry = geom;
      });
    }
    currentEventAtom.subscribe((event) => {
      this._eventId = event?.id ?? null;
    });
  }

  public onInit() {
    return { isVisible: true, isLoading: false };
  }

  public async willMount(map: ApplicationMap) {
    const params: {
      layerIds?: string[];
      geoJSON?: GeoJSON.GeoJSON;
      eventId?: string;
    } = this.boundaryRequiredForRetrieval
      ? {
          layerIds: [this.id],
          geoJSON: this._focusedGeometry?.geometry,
        }
      : {
          layerIds: [this.id],
        };

    if (this._eventId) {
      params.eventId = this._eventId;
    }
    const response = await apiClient.post<LayerInAreaSource>(
      '/layers/details',
      params,
      false,
    );
    if (response) {
      const { source } = response[0];
      const sourceData =
        source.type === 'geojson'
          ? {
              type: 'geojson' as const,
              data: source.data,
            }
          : {
              type: source.type,
              url: source.url,
              tileSize: source.tileSize,
            };
      map.addSource(this._sourceId, sourceData);

      // TODO: Add style generation from mapCSS
      // TODO: Add colorizing by legend
      if (this.legend) {
        const layers = mapCSSToMapBoxProperties(this.legend.steps[0].style);

        layers.forEach((layer, i) => {
          const layerId = `${LAYER_IN_AREA_PREFIX + this.id}-${i}`;
          const mapLayer = { ...layer, id: layerId, source: this._sourceId };
          this._layerIds.push(layerId);
          map.addLayer(mapLayer as AnyLayer);
        });
      } else {
        const layerId = `${LAYER_IN_AREA_PREFIX + this.id}`;
        this._layerIds.push(layerId);
        map.addLayer({
          id: layerId,
          source: this._sourceId,
          type: 'fill',
          paint: {
            'fill-color': 'pink',
          },
        });
      }

      this._onClickListener = (e) => this.onMapClick(map, e);
      map.on('click', this._onClickListener);
    }
  }

  public willUnmount(map: ApplicationMap) {
    this._layerIds.forEach((id) => {
      map.removeLayer(id);
    });
    map.removeSource(this._sourceId);
    if (this._onClickListener) {
      map.off('click', this._onClickListener);
    }
  }

  async onMapClick(
    map: ApplicationMap,
    ev: { lngLat: { lng: number; lat: number } },
  ) {
    if (!ev || !ev.lngLat) return;
    // TODO: open link on new tab if feature contain url
  }
}
