import { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import {
  AnyLayer,
  VectorSource,
  RasterSource,
  GeoJSONSourceRaw,
} from 'maplibre-gl';
import { LogicalLayer, LayerLegend } from '~utils/atoms/createLogicalLayerAtom';
import { mapCSSToMapBoxProperties } from '~utils/map/mapCSSToMapBoxPropertiesConverter';
import { apiClient } from '~core/index';
import { LAYER_IN_AREA_PREFIX, SOURCE_IN_AREA_PREFIX } from '../constants';
import {
  LayerInArea,
  LayerInAreaSource,
  LayerGeoJSONSource,
  LayerTileSource,
} from '../types';
import {
  FocusedGeometry,
  focusedGeometryAtom,
} from '~core/shared_state/focusedGeometry';
import { currentEventAtom } from '~core/shared_state';

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

  mountGeoJSONLayer(map: ApplicationMap, layer: LayerGeoJSONSource) {
    /* Create source */
    const mapSource: GeoJSONSourceRaw = {
      type: 'geojson' as const,
      data: layer.source.data,
    };
    map.addSource(this._sourceId, mapSource);

    /* Create layer */
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
  }

  _adaptUrl(url: string) {
    /**
     * Protocol fix
     * request from https to http failed in browser with "mixed content" error
     * solution: cut off protocol part - in that case browser will use page protocol
     */
    url = url.replace('https:', '').replace('http:', '');

    /**
     * Some link templates use values that mapbox/maplibre do not understand
     * solution: convert to equivalents
     */
    url = url
      .replace('{bbox}', '{bbox-epsg-3857}')
      .replace('{proj}', 'EPSG:3857')
      .replace('{width}', '256')
      .replace('{height}', '256')
      .replace('{zoom}', '{z}')
      .replace('{-y}', '{y}');

    /* Some magic for remove `switch:` */
    const domains = (url.match(/{switch:(.*?)}/) || ['', ''])[1].split(',')[0];
    url = url.replace(/{switch:(.*?)}/, domains);

    return url;
  }

  /* https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/#vector-scheme */
  _setTileScheme(rawUrl: string, mapSource: VectorSource | RasterSource) {
    const isTMS = rawUrl.includes('{-y}');
    if (isTMS) {
      mapSource.scheme = 'tms';
    }
  }

  mountTileLayer(map: ApplicationMap, layer: LayerTileSource) {
    /* Create source */
    const mapSource: VectorSource | RasterSource = {
      type: layer.source.type,
      tiles: layer.source.urls.map((url) => this._adaptUrl(url)),
      tileSize: layer.source.tileSize || 256,
    };

    // I expect that all servers provide url with same scheme
    this._setTileScheme(layer.source.urls[0], mapSource);

    map.addSource(this._sourceId, mapSource);

    /* Create layer */
    if (mapSource.type === 'raster') {
      const layerId = `${LAYER_IN_AREA_PREFIX + this.id}`;
      const mapLayer = {
        id: layerId,
        type: 'raster' as const,
        source: this._sourceId,
        minzoom: layer.minZoom || 0,
        maxzoom: layer.maxZoom || 22,
      };
      map.addLayer(mapLayer);
      this._layerIds.push(layerId);
    } else {
      if (this.legend) {
        if (this.legend.type === 'simple') {
          const layers = mapCSSToMapBoxProperties(this.legend.steps[0].style);
          layers.forEach((layer, i) => {
            const layerId = `${LAYER_IN_AREA_PREFIX + this.id}-${i}`;
            const mapLayer = { ...layer, id: layerId, source: this._sourceId };
            this._layerIds.push(layerId);
            map.addLayer(mapLayer as AnyLayer);
            this._layerIds.push(layerId);
          });
        } else {
          console.error('Bivariate legend not implemented yet');
        }
      } else {
        // We don't known source-layer id
        throw new Error(
          `[GenericLayer ${this.id}] Vector layers must have legend`,
        );
      }
    }
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
    const response = await apiClient.post<LayerInAreaSource[]>(
      '/layers/details',
      params,
      false,
    );
    if (response) {
      const firstLayer = response[0];
      const isGeoJSONLayer = (
        layer: LayerInAreaSource,
      ): layer is LayerGeoJSONSource => layer.source.type === 'geojson';
      if (isGeoJSONLayer(firstLayer)) {
        this.mountGeoJSONLayer(map, firstLayer);
      } else {
        this.mountTileLayer(map, firstLayer);
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
