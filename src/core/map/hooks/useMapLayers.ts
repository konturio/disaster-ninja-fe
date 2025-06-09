import { useArrayDiff } from '~components/ConnectedMap/map-libre-adapter/useArrayDiff';
import { useMapEffect } from './useMapEffect';
import type { IMap } from '../providers/IMapProvider';
import type { LayerSpecification } from 'maplibre-gl';

interface LayerManagementOptions {
  layersOnTop?: string[];
  cleanup?: boolean;
}

export function useMapLayers<TMap extends IMap>(
  map: TMap,
  layers: LayerSpecification[],
  options: LayerManagementOptions = {},
): void {
  const { added: addedLayers, deleted: deletedLayers } = useArrayDiff(layers, false);

  const { layersOnTop = [], cleanup = true } = options;

  useMapEffect(
    map,
    (map) => {
      addedLayers.forEach((layer) => {
        const previouslyAdded = map.getLayer(layer.id) !== undefined;

        if (previouslyAdded) {
          map.setLayoutProperty(layer.id, 'visibility', 'visible');
        } else {
          const beforeLayer = layersOnTop.find(
            (id) => map.getLayer(id) !== undefined && !layersOnTop.includes(layer.id),
          );

          map.addLayer(layer, beforeLayer);
        }
      });

      deletedLayers.forEach((layer) => {
        if (cleanup) {
          map.removeLayer(layer.id);
          const layerSource = 'source' in layer ? layer.source : null;
          if (layerSource) {
            const sourceInUse = map
              .getStyle()
              .layers?.some((l: any) => l.source === layerSource && l.id !== layer.id);
            if (!sourceInUse) {
              map.removeSource(layerSource as string);
            }
          }
        } else {
          map.setLayoutProperty(layer.id, 'visibility', 'none');
        }
      });
    },
    [addedLayers, deletedLayers, layersOnTop, cleanup],
  );
}
