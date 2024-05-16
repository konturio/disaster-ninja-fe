import { layerByOrder } from '~core/logical_layers';
import { UserGeometryRenderer } from '~core/logical_layers/renderers/UserGeometryRenderer';
import Icon from '../icons/marker_darkblue.png';
import { REFERENCE_AREA_COLOR } from '../constants';
import type { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';

const icons = {
  refAreaPoint: Icon,
};

/**
 * TODO:
 * rewrite it to mapcss and create layers from legendAtom in willLegendUpdate
 */
const getLayersConfig = (
  id: string,
  sourceId: string,
): maplibregl.LayerSpecification[] => {
  const iconsKeys = Object.keys(icons).reduce(
    (acc, k) => ((acc[k] = k), acc),
    {} as unknown as Record<keyof typeof icons, string>,
  );
  return [
    {
      id: id + '-outline',
      source: sourceId,
      type: 'line' as const,
      paint: {
        'line-width': 8,
        'line-color': '#FFF',
        'line-opacity': 0.5,
        'line-offset': -3,
      },
      layout: {
        'line-join': 'round',
      },
    },
    {
      id: id + '-main',
      source: sourceId,
      type: 'line' as const,
      paint: {
        'line-width': 5,
        'line-color': REFERENCE_AREA_COLOR,
        'line-offset': -2,
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
        'icon-image': iconsKeys.refAreaPoint, // reference the image
        'icon-size': 0.25,
        'icon-allow-overlap': true,
        'icon-anchor': 'bottom',
      },
    },
  ];
};

export class ReferenceAreaRenderer extends UserGeometryRenderer {
  constructor({ id }) {
    super(id, getLayersConfig, icons);
  }

  async setupLayersOrder(map: ApplicationMap) {
    this.layerConfigs.map(async (layerConfig) => {
      layerByOrder(map).addAboveLayerWithSameType(layerConfig, this.id);
    });
  }
}
