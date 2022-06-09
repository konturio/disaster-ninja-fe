import { LogicalLayerDefaultRenderer } from '~core/logical_layers/renderers/DefaultRenderer';
import { createGeoJSONSource } from '~utils/geoJSON/helpers';
import { layerByOrder } from '~utils/map/layersOrder';
import type {
  ApplicationLayer,
  ApplicationMap,
} from '~components/ConnectedMap/ConnectedMap';
import type { LogicalLayerState } from '~core/logical_layers/types/logicalLayer';
import type { LayerGeoJSONSource } from '~core/logical_layers/types/source';

export class BoundarySelectorRenderer extends LogicalLayerDefaultRenderer {
  public readonly layerId: string;
  public readonly sourceId: string;
  public hoveredLayerConfig: ApplicationLayer;

  public constructor({
    layerId,
    sourceId,
    color,
  }: {
    layerId: string;
    sourceId: string;
    color: string;
  }) {
    super();
    this.layerId = layerId;
    this.sourceId = sourceId;
    this.hoveredLayerConfig = {
      id: this.layerId,
      type: 'line',
      source: this.sourceId,
      paint: {
        'line-color': color,
        'line-width': 2,
        'line-opacity': 0.7,
      },
    };
  }

  public willMount({
    map,
    state,
  }: {
    map: ApplicationMap;
    state: LogicalLayerState;
  }) {
    /* I cast this type because I known backend response me with geojson source */
    const source = state.source as LayerGeoJSONSource | null;

    const geoJsonSource = createGeoJSONSource(
      source ? source.source.data : undefined,
    );
    map.addSource(this.sourceId, geoJsonSource);
    layerByOrder(map).addAboveLayerWithSameType(this.hoveredLayerConfig);
  }

  public willUnMount({ map }: { map: ApplicationMap }) {
    map.removeLayer(this.hoveredLayerConfig.id);
    map.removeSource(this.sourceId);
  }

  public willSourceUpdate({
    map,
    state,
  }: {
    map: ApplicationMap;
    state: LogicalLayerState;
  }) {
    /* I cast this type because I known backend response me with geojson source */
    const source = state.source as LayerGeoJSONSource;
    const data = source.source.data;
    const hoveredBoundarySource = map.getSource(this.sourceId);
    if (hoveredBoundarySource && 'setData' in hoveredBoundarySource) {
      hoveredBoundarySource.setData(data);
    }
  }
}
