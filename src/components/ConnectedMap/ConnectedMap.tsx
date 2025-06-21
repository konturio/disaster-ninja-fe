import { useMemo, Suspense, useRef } from 'react';
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
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { MapLibreContainer } from './MapLibreContainer';
import type {
  Map as MapLibreMap,
  MapOptions as MapLibreOptions,
  LayerSpecification,
} from 'maplibre-gl';

export type ApplicationMap = MapLibreMap;
export type ApplicationLayer = LayerSpecification;

const LAYERS_ON_TOP = [
  'editable-layer',
  'hovered-boundaries-layer',
  'selected-boundaries-layer',
];
// Global map instance to prevent multiple map creation
let globalMapInstance: MapLibreMap | null = null;

function MapContainer() {
  const [initialPosition] = useAtom(currentMapPositionAtom, [], false); // do not subsctibe to atom
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

      onMapCreated: (map) => {
        // Return existing instance if available
        if (globalMapInstance) {
          console.warn('Reusing existing MapLibre map instance');
          setCurrentMap(globalMapInstance);
          return;
        }

        // Apply default extent if no URL position was used
        if (!initialPosition) {
          const extent = configRepo.get().extent;
          if (extent) {
            map.fitBounds(extent, { animate: false });
          }
        }

        // Store as global singleton
        globalMapInstance = map;
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

        // Store cleanup function for unmount
        (map as any)._cleanup = () => {
          layersOrderManager.destroy();
          if (globalThis.KONTUR_MAP === map) {
            globalThis.KONTUR_MAP = undefined;
          }
          if (globalMapInstance === map) {
            globalMapInstance = null;
          }
        };
      },

      onMapDestroy: (map) => {
        // Use stored cleanup if available
        const cleanup = (map as any)._cleanup;
        if (cleanup && typeof cleanup === 'function') {
          cleanup();
        } else {
          // Fallback cleanup
          layersOrderManager.destroy();
          if (globalMapInstance === map) {
            globalMapInstance = null;
          }
        }
      },
    }),
    [],
  );

  return (
    <MapLibreContainer options={options}>
      {(map) => <MapIntegration map={map} />}
    </MapLibreContainer>
  );
}

function MapIntegration({ map }: { map: MapLibreMap }) {
  const popoverService = useMapPopoverService();

  // MapPopover integration with proper position tracking
  useMapPopoverMaplibreIntegration({
    map,
    popoverService,
    enabled: true,
    trackingThrottleMs: 16,
  });

  return null;
}

export function ConnectedMap() {
  return (
    <MapPopoverProvider registry={mapPopoverRegistry}>
      <Suspense fallback={<LoadingSpinner />}>
        <MapContainer />
      </Suspense>
    </MapPopoverProvider>
  );
}
