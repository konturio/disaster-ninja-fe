import { LogicalLayerDefaultRenderer } from '~core/logical_layers/renderers/DefaultRenderer';
import { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import { GeoJSONSource } from 'maplibre-gl';
import { layersOrderManager } from '~core/logical_layers/utils/layersOrder';
import Icon from '../icons/marker_black.png';
import { LogicalLayerState } from '~core/logical_layers/types/logicalLayer';
import { waitMapEvent } from '~utils/map/waitMapEvent';
import { loadImageOnMap } from '~utils/map/loadImageOnMap';
import { FOCUSED_GEOMETRY_COLOR } from '../constants';

const icons = {
  place: Icon,
};

/**
 * TODO:
 * rewrite it to mapcss and create layers from legendAtom in willLegendUpdate
 */
const getLayersConfig = (
  id: string,
  sourceId: string,
): maplibregl.AnyLayer[] => {
  const iconsKeys = Object.keys(icons).reduce(
    (acc, k) => ((acc[k] = k), acc),
    {} as unknown as Record<keyof typeof icons, string>,
  );
  return [
    {
      id: id + '-main',
      source: sourceId,
      type: 'line' as const,
      paint: {
        'line-width': 6,
        'line-color': FOCUSED_GEOMETRY_COLOR,
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
    {
      id: id + '-point',
      source: sourceId,
      type: 'symbol' as const,
      filter: ['==', '$type', 'Point'],
      layout: {
        'icon-image': iconsKeys.place, // reference the image
        'icon-size': 0.25,
        'icon-allow-overlap': true,
        'icon-anchor': 'bottom',
      },
    },
  ];
};

export class FocusedGeometryRenderer extends LogicalLayerDefaultRenderer {
  public readonly id: string;
  private sourceId: string;
  private layerConfigs: maplibregl.AnyLayer[] = [];
  private availableIcons: Set<string> = new Set();

  constructor({ id }) {
    super();
    this.id = id;
    this.sourceId = `${id}-source`;
    this.layerConfigs = getLayersConfig(this.id + '-layer', this.sourceId);
  }

  removeSourcesAndLayers({ map }: { map: ApplicationMap }) {
    if (!map.getSource(this.sourceId)) {
      /* Sometimes in DEV after HMR it happen before source mounted */
      return;
    }
    this.layerConfigs.forEach(({ id }) => {
      map.getLayer(id) && map.removeLayer(id);
    });
    map.getSource(this.sourceId) && map.removeSource(this.sourceId);
  }

  async setupIcon(map: ApplicationMap, id: string, url: string) {
    // @ts-expect-error
    // it seems to me that map._loaded represents current map state which is needed,
    // whereas map.loaded() or map.isStyleLoaded() check allows
    // to set a callback on map.on('load') method, that will never run
    !map._loaded && (await waitMapEvent(map, 'load'));
    const image = await loadImageOnMap(map, url);
    map.addImage(id, image);
    this.availableIcons.add(id);
  }

  async getIcon(map: ApplicationMap, id: string, iconUrl: string) {
    if (!this.availableIcons.has(id)) {
      await this.setupIcon(map, id, iconUrl);
    }
    return iconUrl;
  }

  async updateOrSetSource({
    map,
    state,
    isInitialLoad = false,
  }: {
    map: ApplicationMap;
    state: LogicalLayerState;
    isInitialLoad?: boolean;
  }) {
    // TODO adress this logic in task 9295

    // @ts-expect-error
    // see comment on top
    !map._loaded && (await waitMapEvent(map, 'load'));

    const stateSource = state.source?.source ?? null;
    // I'm cast type here because i known that in willMount i add geojson source
    const mapSource = map.getSource(this.sourceId) as GeoJSONSource;

    if (isInitialLoad) {
      !mapSource &&
        map.addSource(
          this.sourceId,
          stateSource || {
            data: { type: 'FeatureCollection', features: [] },
            type: 'geojson',
          },
        );
      return true;
    }

    if (stateSource === null) {
      mapSource.setData({ type: 'FeatureCollection', features: [] });
      return true;
    }

    if (stateSource.type !== 'geojson') {
      this.removeSourcesAndLayers({ map });
      throw Error('Focused geometry must be geojson');
    }

    if (
      stateSource.data.type !== 'FeatureCollection' &&
      stateSource.data.type !== 'Feature'
    ) {
      this.removeSourcesAndLayers({ map });
      throw Error('Focused geometry must be Feature or FeatureCollection');
    }

    if (mapSource === undefined) {
      map.addSource(this.sourceId, stateSource);
    } else mapSource.setData(stateSource.data);
    return true;
  }

  /* ======== Hooks ========== */
  async willMount({
    map,
    state,
  }: {
    map: ApplicationMap;
    state: LogicalLayerState;
  }) {
    const sourceAdded = await this.updateOrSetSource({
      map,
      state,
      isInitialLoad: true,
    });
    await Promise.all(
      Object.entries(icons).map(([id, url]) => this.getIcon(map, id, url)),
    );
    if (sourceAdded) {
      this.layerConfigs.map(async (layerConfig) => {
        layersOrderManager.getBeforeIdByType(layerConfig.type, (beforeId) => {
          map.addLayer(layerConfig, beforeId);
        });
      });
    }
  }

  willSourceUpdate({
    map,
    state,
  }: {
    map: ApplicationMap | null;
    state: LogicalLayerState;
  }) {
    if (!state.isMounted) return;
    if (!map) return;
    this.updateOrSetSource({ map, state, isInitialLoad: false });
  }

  willUnMount({ map }: { map: ApplicationMap }) {
    this.removeSourcesAndLayers({ map });
  }

  willHide({ map }: { map: ApplicationMap }) {
    this.layerConfigs.forEach(({ id }) => {
      map.setLayoutProperty(id, 'visibility', 'none');
    });
  }

  willUnhide({ map }: { map: ApplicationMap }) {
    this.layerConfigs.forEach(({ id }) => {
      map.setLayoutProperty(id, 'visibility', 'visible');
    });
  }
}
