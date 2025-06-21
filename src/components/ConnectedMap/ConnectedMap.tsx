import { useMemo } from 'react';
import { useAtom } from '@reatom/npm-react';
import { useAction } from '@reatom/react-v2';
import { configRepo } from '~core/config';
import { currentMapPositionAtom } from '~core/shared_state/currentMapPosition';
import { currentMapAtom } from '~core/shared_state/currentMap';
import { layersOrderManager } from '~core/logical_layers/utils/layersOrder/layersOrder';
import { layersSettingsAtom } from '~core/logical_layers/atoms/layersSettings';
import { mapLibreParentsIds } from '~core/logical_layers/utils/layersOrder/mapLibreParentsIds';
import { mapPopoverRegistry } from '~core/map/popover/globalMapPopoverRegistry';
import {
  MapPopoverProvider,
  useMapPopoverService,
} from '~core/map/popover/MapPopoverProvider';
import { useMapPopoverMaplibreIntegration } from '~core/map/hooks/useMapPopoverMaplibreIntegration';
import { registerMapListener } from '~core/shared_state/mapListeners';
import { MapLibreContainer } from './MapLibreContainer';
import type {
  Map as MapLibreMap,
  MapOptions as MapLibreOptions,
  LayerSpecification,
  MapMouseEvent,
} from 'maplibre-gl';

export type ApplicationMap = MapLibreMap;
export type ApplicationLayer = LayerSpecification;

export function ConnectedMap({ className }: { className?: string }) {
  // do not subsctibe to atom, just read initial value
  const [initialPosition] = useAtom(currentMapPositionAtom, [], false);
  const setCurrentMap = useAction(currentMapAtom.setMap);

  const options = useMemo(
    () => ({
      getConfig: () => {
        const config: Partial<MapLibreOptions> = {
          style: configRepo.get().mapBaseStyle,
          attributionControl: false,
        };

        // Apply URL position as initial map position ONLY
        if (initialPosition) {
          if ('bbox' in initialPosition) {
            config.bounds = initialPosition.bbox;
          } else {
            config.center = [initialPosition.lng, initialPosition.lat];
            config.zoom = initialPosition.zoom;
          }
        }

        return config as Omit<MapLibreOptions, 'container'>;
      },

      onMapCreated: (map: MapLibreMap) => {
        // Apply default extent if no URL position was used
        if (!initialPosition) {
          const extent = configRepo.get().extent;
          if (extent) {
            map.fitBounds(extent, { animate: false });
          }
        }

        setCurrentMap(map);

        // Set up light for extrusion layers
        map.once('styledata', () => {
          map.setLight({ anchor: 'viewport', color: '#FFF', intensity: 1 });
        });

        // Global map access for debugging
        if (!globalThis.KONTUR_MAP) {
          globalThis.KONTUR_MAP = map;
        }

        // Disable rotation
        map.touchZoomRotate.disableRotation();

        // Layers manager initialization - wait for map to load
        map.once('load', () => {
          layersOrderManager.init(map, mapLibreParentsIds, layersSettingsAtom);
        });
      },

      onMapDestroy: (map: MapLibreMap) => {
        layersOrderManager.destroy();
        if (globalThis.KONTUR_MAP === map) {
          globalThis.KONTUR_MAP = undefined;
        }
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <MapPopoverProvider registry={mapPopoverRegistry}>
      <MapLibreContainer options={options} className={className}>
        {(map) => <MapIntegration map={map} />}
      </MapLibreContainer>
    </MapPopoverProvider>
  );
}

// should we repsect featureFlags[AppFeature.TOOLTIP] ?
function MapIntegration({ map }: { map: MapLibreMap }) {
  const popoverService = useMapPopoverService();

  // Create global event handlers using priority system
  const eventHandlers = useMemo(
    () => ({
      onClick: (handler: (event: MapMouseEvent) => boolean) =>
        registerMapListener('click', handler, 55),
      onMove: (handler: () => boolean) => registerMapListener('move', handler, 80),
    }),
    [],
  );

  // MapPopover integration with proper position tracking
  useMapPopoverMaplibreIntegration({
    map,
    popoverService,
    enabled: true,
    trackingThrottleMs: 16,
    eventHandlers,
  });

  return null;
}
