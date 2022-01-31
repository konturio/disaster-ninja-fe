import { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import maplibregl, {
  AnyLayer,
  GeoJSONSourceRaw,
  RasterSource,
  VectorSource,
} from 'maplibre-gl';
import type {
  LayerLegend,
  LogicalLayer,
} from '~core/logical_layers/createLogicalLayerAtom';
import {
  applyLegendConditions,
  mapCSSToMapBoxProperties,
  setSourceLayer,
} from '~utils/map/mapCSSToMapBoxPropertiesConverter';
import { apiClient, notificationService } from '~core/index';
import { LAYER_IN_AREA_PREFIX, SOURCE_IN_AREA_PREFIX } from '../constants';
import {
  LayerGeoJSONSource,
  LayerInArea,
  LayerInAreaReactiveData,
  LayerInAreaSource,
  LayerTileSource,
} from '../types';
import {
  addZoomFilter,
  onActiveContributorsClick,
} from './activeContributorsLayers';
import { layersOrderManager } from '~core/logical_layers/layersOrder';
import { registerMapListener } from '~core/shared_state/mapListeners';
import { enabledLayersAtom } from '~core/shared_state';
import { downloadObject } from '~utils/fileHelpers/download';

export class GenericLayer
  implements LogicalLayer<LayerInAreaReactiveData | null>
{
  public readonly id: string;
  public readonly name?: string;
  public legend?: LayerLegend;
  public readonly category?: string;
  public readonly group?: string;
  public readonly description?: string;
  public readonly copyrights?: string[];
  public readonly boundaryRequiredForRetrieval: boolean;
  public isDownloadable = false;
  private _layerIds: Set<string>;
  private _sourceId: string;
  private _onClickListener:
    | ((e: maplibregl.MapMouseEvent & maplibregl.EventData) => void)
    | null = null;
  private _lastGeometryUpdate:
    | GeoJSON.Feature
    | GeoJSON.FeatureCollection
    | null = null;
  private _eventId: string | null = null;
  private _removeClickListener: null | (() => void) = null;

  public constructor(layer: LayerInArea, initialData: LayerInAreaReactiveData) {
    this.id = layer.id;
    this.name = layer.name;
    this.category = layer.category;
    this.group = layer.group;
    this.description = layer.description;
    this.copyrights = layer.copyrights;
    this.boundaryRequiredForRetrieval = layer.boundaryRequiredForRetrieval;
    this.legend = layer.legend;
    /* private */
    this._layerIds = new Set();
    this._sourceId = SOURCE_IN_AREA_PREFIX + layer.id;
    this._updateFromReactiveData(initialData);
  }

  _updateFromReactiveData(data: LayerInAreaReactiveData | null) {
    this._lastGeometryUpdate = null;
    this._eventId = null;

    if (data === null) return;

    const { focusedGeometry } = data.requestParams;
    if (focusedGeometry) {
      const { geometry, source } = focusedGeometry;

      // Update geometry
      if (
        geometry.type === 'Feature' ||
        geometry.type === 'FeatureCollection'
      ) {
        this._lastGeometryUpdate = geometry;
      } else {
        // TODO: Add converter from any GeoJSON to Feature or FeatureCollection
        notificationService.error({
          title: 'Not implemented yet',
          description: `${geometry.type} not supported`,
        });
      }

      // Update event id
      if (source.type === 'event') {
        this._eventId = source.meta.eventId;
      }
    }
  }

  _generateLayersFromLegend(legend: LayerLegend): Omit<AnyLayer, 'id'>[] {
    if (legend.type === 'simple') {
      const layers = legend.steps
        /**
         * Layer filters method generate extra layers for legend steps, but it simple and reliably.
         * Find properties diff between steps and put expressions right into property value
         * if tou need more map performance
         * */
        .map((step) =>
          setSourceLayer(
            step,
            applyLegendConditions(step, mapCSSToMapBoxProperties(step.style)),
          ),
        );
      return layers.flat();
    }

    if (legend.type === 'bivariate') {
      throw new Error(
        'Bivariate legend can only belong to layer with type bivariate',
      );
    }

    /* @ts-expect-error - if backend add new legend type */
    throw new Error(`Unexpected legend type '${legend.type}'`);
  }

  _setLayersIds(layers: Omit<AnyLayer, 'id'>[]): AnyLayer[] {
    return layers.map((layer, i) => {
      const layerId = `${LAYER_IN_AREA_PREFIX + this.id}-${i}`;
      const mapLayer = { ...layer, id: layerId, source: this._sourceId };
      return mapLayer as AnyLayer;
    });
  }

  mountGeoJSONLayer(map: ApplicationMap, layer: LayerGeoJSONSource) {
    /* Create source */
    const mapSource: GeoJSONSourceRaw = {
      type: 'geojson' as const,
      data: layer.source.data,
    };
    const source = map.getSource(this._sourceId) as maplibregl.GeoJSONSource;

    /* Mount or update source */
    if (!source) {
      map.addSource(this._sourceId, mapSource);
    } else {
      source.setData(
        mapSource.data || {
          type: 'FeatureCollection',
          features: [],
        },
      );
    }

    /* Create layer */
    if (this.legend) {
      const layerStyles = this._generateLayersFromLegend(this.legend);
      const layers = this._setLayersIds(layerStyles);
      layers.forEach((mapLayer) => {
        const layer = map.getLayer(mapLayer.id);
        if (layer) {
          map.removeLayer(layer.id);
        }
        const beforeId = layersOrderManager.getBeforeIdByType(mapLayer.type);
        map.addLayer(mapLayer, beforeId);
        this._layerIds.add(mapLayer.id);
      });
    } else {
      // Fallback layer
      const layerId = `${LAYER_IN_AREA_PREFIX + this.id}`;
      if (map.getLayer(layerId)) return;
      const mapLayer = {
        id: layerId,
        source: this._sourceId,
        type: 'fill' as const,
        paint: {
          'fill-color': 'pink' as const,
        },
      };
      const beforeId = layersOrderManager.getBeforeIdByType(mapLayer.type);
      map.addLayer(mapLayer, beforeId);
      this._layerIds.add(mapLayer.id);
    }

    // TODO: Remove unused in new legend layers
  }

  _adaptUrl(url: string) {
    /** Fix cors in local development */
    if (import.meta.env.DEV) {
      url = url.replace('zigzag.kontur.io', location.host);
    }

    /**
     * Protocol fix
     * request from https to http failed in browser with "mixed content" error
     * solution: cut off protocol part and replace with current page protocol
     */
    url =
      window.location.protocol + url.replace('https:', '').replace('http:', '');

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
      minzoom: layer.minZoom || 0,
      maxzoom: layer.maxZoom || 22,
    };

    // I expect that all servers provide url with same scheme
    this._setTileScheme(layer.source.urls[0], mapSource);

    const source = map.getSource(this._sourceId);
    if (source) {
      // TODO: update tile source
    } else {
      map.addSource(this._sourceId, mapSource);
    }

    /* Create layer */
    if (mapSource.type === 'raster') {
      const layerId = `${LAYER_IN_AREA_PREFIX + this.id}`;
      if (map.getLayer(layerId)) return;
      const mapLayer = {
        id: layerId,
        type: 'raster' as const,
        source: this._sourceId,
        minzoom: 0,
        maxzoom: 22,
      };
      const beforeId = layersOrderManager.getBeforeIdByType(mapLayer.type);
      map.addLayer(mapLayer, beforeId);
      this._layerIds.add(layerId);
    } else {
      // Vector tiles
      if (this.legend) {
        const layerStyles = this._generateLayersFromLegend(this.legend);
        const layers = this._setLayersIds(layerStyles);
        // !FIXME - Hardcoded filter for layer
        // Must be deleted after LayersDB implemented
        if (this.id === 'activeContributors') {
          addZoomFilter(layers);
        }
        layers.forEach((mapLayer) => {
          if (map.getLayer(mapLayer.id)) {
            map.removeLayer(mapLayer.id);
          }
          const beforeId = layersOrderManager.getBeforeIdByType(mapLayer.type);
          map.addLayer(mapLayer as AnyLayer, beforeId);
          this._layerIds.add(mapLayer.id);
        });
      } else {
        // We don't known source-layer id
        throw new Error(
          `[GenericLayer ${this.id}] Vector layers must have legend`,
        );
      }
    }
  }

  async _fetchLayerData() {
    let params: {
      layerIds?: string[];
      geoJSON?: GeoJSON.GeoJSON;
      eventId?: string;
    };

    if (this._eventId === null && this._lastGeometryUpdate === null) {
      // TODO: temporary solution until #8421 was not merged
      return;
    }

    if (this.boundaryRequiredForRetrieval) {
      if (this._lastGeometryUpdate === null) {
        throw Error(`Layer ${this.id} require geometry, but geometry is null`);
      }
      params = {
        layerIds: [this.id],
        geoJSON: this._lastGeometryUpdate,
      };
    } else {
      params = {
        layerIds: [this.id],
      };
    }

    if (this._eventId) {
      params.eventId = this._eventId;
    }

    const response = await apiClient.post<LayerInAreaSource[]>(
      '/layers/details',
      params,
      false,
    );

    /* Api allow us fetch bunch of layers, but here we take only one */
    if (response) return response[0];
  }

  isGeoJSONLayer = (layer: LayerInAreaSource): layer is LayerGeoJSONSource =>
    layer.source.type === 'geojson';

  async _updateMap(map: ApplicationMap) {
    const layerData = await this._fetchLayerData();
    if (!layerData) return;
    if (this.isGeoJSONLayer(layerData)) {
      this.mountGeoJSONLayer(map, layerData);
      this.isDownloadable = true;
    } else {
      this.mountTileLayer(map, layerData);
    }

    /* Add event listener */
    if (this.legend) {
      // !FIXME - Hardcoded filter for layer
      // Must be deleted after LayersDB implemented
      if (this.id === 'activeContributors') {
        const onClick = onActiveContributorsClick(map, this._sourceId);
        this._removeClickListener = registerMapListener(
          'click',
          (e) => (onClick(e), true),
          60,
        );
        return;
      }

      const linkProperty =
        'linkProperty' in this.legend ? this.legend.linkProperty : null;
      if (linkProperty) {
        const handler = (e) => {
          this.onMapClick(map, e, linkProperty);
          return true;
        };
        this._removeClickListener = registerMapListener('click', handler, 60);
      }
    }
  }

  public onInit() {
    return { isVisible: true, isLoading: false };
  }

  public willEnabled(map?: ApplicationMap) {
    return [enabledLayersAtom.add(this.id)];
  }

  public willDisabled(map?: ApplicationMap) {
    return [enabledLayersAtom.remove(this.id)];
  }

  public async willMount(map: ApplicationMap) {
    this._updateMap(map);
    return this.legend ?? null;
  }

  async onDataChange(
    map: ApplicationMap | null,
    data: LayerInAreaReactiveData | null,
    state,
  ) {
    this.legend = data?.layer.legend;
    this._updateFromReactiveData(data);
    // Update layer data
    if (map && state.isMounted) {
      this._updateMap(map);
    }
  }

  public willUnmount(map: ApplicationMap) {
    this._layerIds.forEach((id) => {
      if (map.getLayer(id) !== undefined) {
        map.removeLayer(id);
      } else {
        console.error(
          `Can't remove layer with ID: ${id}. Layer does't exist in map`,
        );
      }
    });
    this._layerIds = new Set();

    if (this._sourceId) {
      if (map.getSource(this._sourceId) !== undefined) {
        map.removeSource(this._sourceId);
      } else {
        console.error(
          `Can't remove source with ID: ${this._sourceId}. Source does't exist in map`,
        );
      }
    }

    this._removeClickListener?.();
  }

  wasRemoveFromInRegistry(map: ApplicationMap) {
    this.willUnmount(map);
  }

  async onMapClick(
    map: ApplicationMap,
    ev: maplibregl.MapMouseEvent & maplibregl.EventData,
    linkProperty: string,
  ) {
    if (!ev || !ev.lngLat) return;
    const thisLayersFeatures = ev.target
      .queryRenderedFeatures(ev.point)
      .filter((f) => f.source.includes(this._sourceId));

    if (thisLayersFeatures.length === 0) return;
    const featureWithLink = thisLayersFeatures.find(
      (feature) => feature.properties?.[linkProperty] !== undefined,
    );
    if (featureWithLink === undefined) return;
    const link = featureWithLink[linkProperty];
    window.open(link);
  }

  willHide(map: ApplicationMap) {
    this._layerIds.forEach((id) => {
      if (map.getLayer(id) !== undefined) {
        map.setLayoutProperty(id, 'visibility', 'none');
      } else {
        console.error(
          `Can't hide layer with ID: ${id}. Layer doesn't exist on the map`,
        );
      }
    });
  }

  willUnhide(map: ApplicationMap) {
    this._layerIds.forEach((id) => {
      if (map.getLayer(id) !== undefined) {
        map.setLayoutProperty(id, 'visibility', 'visible');
      } else {
        console.error(
          `Cannot unhide layer with ID: ${id}. Layer doesn't exist on the map`,
        );
      }
    });
  }

  public onDownload(map: ApplicationMap) {
    const data: any = map.getSource(this._sourceId);
    if (!data || data.type !== 'geojson')
      return console.error(`Source id ${this._sourceId} can't be downloaded`);
    downloadObject(
      data._data,
      `${
        this.name || 'Disaster Ninja map layer'
      } ${new Date().toISOString()}.json`,
    );
  }
}
