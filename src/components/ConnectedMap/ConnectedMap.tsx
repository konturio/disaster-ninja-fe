import { useCallback, useEffect, useRef } from 'react';
import { Marker } from 'maplibre-gl';
import { useAction, useAtom } from '@reatom/react-v2';
import { currentMapAtom, mapListenersAtom } from '~core/shared_state';
import { layersOrderManager } from '~core/logical_layers/utils/layersOrder/layersOrder';
import { mapLibreParentsIds } from '~core/logical_layers/utils/layersOrder/mapLibreParentsIds';
import { layersSettingsAtom } from '~core/logical_layers/atoms/layersSettings';
import { configRepo } from '~core/config';
import {
  MapPopoverProvider,
  useMapPopoverService,
  mapPopoverRegistry,
  useMapPopoverPriorityIntegration,
} from '~core/map';
import Map from './map-libre-adapter';
import { useMapPositionSync } from './useMapPositionSync';
import type {
  LayerSpecification,
  Map as MapLibreMap,
  MapMouseEvent,
  MarkerOptions,
} from 'maplibre-gl';
// temporary set generic map class to mapbox map
// todo: change mapbox map declaration to generic map later
export type ApplicationMap = MapLibreMap;
export type ApplicationLayer = LayerSpecification;

export class ApplicationMapMarker extends Marker {
  public readonly id: string;

  public constructor(id: string, element?: HTMLElement, options?: MarkerOptions) {
    super({ ...options, element });
    this.id = id;
  }
}

const LAYERS_ON_TOP = [
  'editable-layer',
  'hovered-boundaries-layer',
  'selected-boundaries-layer',
];

function ConnectedMapWithPopover({ className }: { className?: string }) {
  const mapBaseStyle = configRepo.get().mapBaseStyle;
  const mapRef = useRef<ApplicationMap>();
  const popoverService = useMapPopoverService();

  useMapPositionSync(mapRef);

  // init current MapRefAtom
  const setCurrentMap = useAction(currentMapAtom.setMap);
  const resetCurrentMap = useAction(currentMapAtom.resetMap);

  const [mapListeners] = useAtom(mapListenersAtom);
  const initLayersOrderManager = useCallback(
    (map) =>
      layersOrderManager.init(mapRef.current!, mapLibreParentsIds, layersSettingsAtom),
    [],
  );

  // Simplified popover integration using new hook - eliminates 70+ lines of duplication
  useMapPopoverPriorityIntegration({
    map: mapRef.current || null,
    popoverService,
    registry: mapPopoverRegistry,
    priority: 55, // Between Boundary Selector:50 and Legacy Renderers:60
  });

  useEffect(() => {
    if (mapRef.current && !globalThis.KONTUR_MAP) {
      console.info('Map instance available by window.KONTUR_MAP', mapRef.current);
      globalThis.KONTUR_MAP = mapRef.current;
      // https://maplibre.org/maplibre-gl-js-docs/api/handlers/#touchzoomrotatehandler#disablerotation
      mapRef.current.touchZoomRotate.disableRotation();
      // @ts-expect-error Fix for react dev tools
      mapRef.current.toJSON = () => '[Mapbox Object]';
      // Fix - map fitBounds for incorrectly, because have incorrect internal state abut self canvas size
      // This will force update that state.
      // TODO: Replace map component with map service from event tinter
      // were this problem resolved by more elegant way
      setTimeout(() => {
        requestAnimationFrame(() => {
          // @ts-expect-error Fix for react dev tools
          mapRef.current.resize();
        });
      }, 1000);
    }
    mapRef.current ? setCurrentMap(mapRef.current) : resetCurrentMap();
  }, [mapRef, setCurrentMap]);

  useEffect(() => {
    // for starters lets add click handlers only. It's also easier to read

    const clickHandlers = (event: MapMouseEvent) => {
      for (let i = 0; i < mapListeners.click.length; i++) {
        const { listener } = mapListeners.click[i];
        const passToNextListener = listener(event, mapRef.current);
        if (!passToNextListener) break;
      }
    };
    const mousemoveHandlers = (event: MapMouseEvent) => {
      for (let i = 0; i < mapListeners.mousemove.length; i++) {
        const { listener } = mapListeners.mousemove[i];
        const passToNextListener = listener(event, mapRef.current);
        if (!passToNextListener) break;
      }
    };
    if (mapRef.current) {
      mapRef.current.on('click', clickHandlers);
      mapRef.current.on('mousemove', mousemoveHandlers);
    }
    return () => {
      mapRef.current?.off('click', clickHandlers);
      mapRef.current?.off('mousemove', mousemoveHandlers);
    };
  }, [mapRef, mapListeners]);

  // Resize map canvas when map container changes in size
  useEffect(() => {
    if (mapRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        mapRef.current!.resize();
      });
      const mapContainer = mapRef.current.getCanvasContainer();
      resizeObserver.observe(mapContainer);
      return () => {
        resizeObserver.unobserve(mapContainer);
      };
    }
  }, [mapRef]);

  // cleanup
  useEffect(() => {
    return () => {
      layersOrderManager.destroy();
    };
  }, []);

  return (
    <Map
      ref={mapRef}
      onLoad={initLayersOrderManager}
      layersOnTop={LAYERS_ON_TOP}
      className={className}
      style={mapBaseStyle}
    />
  );
}

export function ConnectedMap({ className }: { className?: string }) {
  return (
    <MapPopoverProvider registry={mapPopoverRegistry}>
      <ConnectedMapWithPopover className={className} />
    </MapPopoverProvider>
  );
}
