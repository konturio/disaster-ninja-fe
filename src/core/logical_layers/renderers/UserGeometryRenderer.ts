import { LogicalLayerDefaultRenderer } from '~core/logical_layers/renderers/DefaultRenderer';
import { mapLoaded } from '~utils/map/waitMapEvent';
import { loadImageOnMap } from '~utils/map/loadImageOnMap';
import { layerByOrder } from '..';
import type { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import type { GeoJSONSource } from 'maplibre-gl';
import type { LogicalLayerState } from '~core/logical_layers/types/logicalLayer';

export class UserGeometryRenderer extends LogicalLayerDefaultRenderer {
  public readonly id: string;
  sourceId: string;
  layerConfigs: maplibregl.LayerSpecification[] = [];
  availableIcons: Set<string> = new Set();
  iconPaths: Record<string, string> = {};

  constructor(
    id: string,
    getLayersConfig: (id: string, sourceId: string) => maplibregl.LayerSpecification[],
    iconPaths: Record<string, string>,
  ) {
    super();
    this.id = id;
    this.sourceId = `${id}-source`;
    this.layerConfigs = getLayersConfig(this.id + '-layer', this.sourceId);
    this.iconPaths = iconPaths;
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
    await mapLoaded(map);
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
    // TODO address this logic in task 9295

    await mapLoaded(map);

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
      throw Error(`User geometry (${this.id}) must be geojson`);
    }

    if (
      stateSource.data.type !== 'FeatureCollection' &&
      stateSource.data.type !== 'Feature'
    ) {
      this.removeSourcesAndLayers({ map });
      throw Error(`User geometry (${this.id}) must be Feature or FeatureCollection`);
    }

    if (mapSource === undefined) {
      map.addSource(this.sourceId, stateSource);
    } else mapSource.setData(stateSource.data);
    return true;
  }

  async setupLayersOrder(map: ApplicationMap) {
    this.layerConfigs.map(async (layerConfig) => {
      layerByOrder(map).addUnderLayerWithSameType(layerConfig, this.id);
    });
  }

  /* ======== Hooks ========== */
  async willMount({ map, state }: { map: ApplicationMap; state: LogicalLayerState }) {
    const sourceAdded = await this.updateOrSetSource({
      map,
      state,
      isInitialLoad: true,
    });
    await Promise.all(
      Object.entries(this.iconPaths).map(([id, url]) => this.getIcon(map, id, url)),
    );
    if (sourceAdded) {
      this.setupLayersOrder(map);
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
