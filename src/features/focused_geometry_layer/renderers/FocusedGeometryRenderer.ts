import { UserGeometryRenderer } from '~core/logical_layers/renderers/UserGeometryRenderer';
import Icon from '../icons/marker_blue.png';
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
): maplibregl.LayerSpecification[] => {
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
        'line-width': 8,
        'line-color': FOCUSED_GEOMETRY_COLOR,
        'line-offset': -3,
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
        'line-width': 10,
        'line-color': '#FFF',
        'line-opacity': 0.5,
        'line-offset': -4,
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

export class FocusedGeometryRenderer extends UserGeometryRenderer {
  constructor({ id }) {
    super(id, getLayersConfig, icons);
  }
}
