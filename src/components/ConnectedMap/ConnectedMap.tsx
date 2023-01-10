import { useCallback, useEffect, useRef } from 'react';
import mapLibre from 'maplibre-gl';
import { useAction, useAtom } from '@reatom/react';
import { currentMapAtom, mapListenersAtom } from '~core/shared_state';
import { layersOrderManager } from '~core/logical_layers/utils/layersOrder/layersOrder';
import config from '~core/app_config';
import { mapLibreParentsIds } from '~core/logical_layers/utils/layersOrder/mapLibreParentsIds';
import { layersSettingsAtom } from '~core/logical_layers/atoms/layersSettings';
import Map from './map-libre-adapter';
import { useMapPositionSmoothSync } from './useMapPositionSmoothSync';

// temporary set generic map class to mapbox map
// todo: change mapbox map declaration to generic map later
export type ApplicationMap = mapLibre.Map;
export type ApplicationLayer = mapLibre.AnyLayer;
export type ApplicationLayerSourceData = mapLibre.AnySourceData;

export class ApplicationMapMarker extends mapLibre.Marker {
  public readonly id: string;

  public constructor(
    id: string,
    element?: HTMLElement,
    options?: maplibregl.MarkerOptions,
  ) {
    super(element, options);
    this.id = id;
  }
}

const LAYERS_ON_TOP = [
  'editable-layer',
  'hovered-boundaries-layer',
  'selected-boundaries-layer',
];

export function ConnectedMap({ className }: { className?: string }) {
  const mapBaseStyle = config.mapBaseStyle;
  const accessToken = config.mapAccessToken;
  const mapRef = useRef<ApplicationMap>();
  useMapPositionSmoothSync(mapRef);

  // init current MapRefAtom
  const setCurrentMap = useAction(currentMapAtom.setMap);
  const resetCurrentMap = useAction(currentMapAtom.resetMap);

  const [mapListeners] = useAtom(mapListenersAtom);
  const initLayersOrderManager = useCallback(
    (map) =>
      layersOrderManager.init(mapRef.current!, mapLibreParentsIds, layersSettingsAtom),
    [],
  );

  useEffect(() => {
    if (mapRef.current && !globalThis.KONTUR_MAP) {
      console.info('Map instance available by window.KONTUR_MAP', mapRef.current);
      globalThis.KONTUR_MAP = mapRef.current;
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

    const clickHandlers = (event: mapLibre.MapMouseEvent & mapLibre.EventData) => {
      for (let i = 0; i < mapListeners.click.length; i++) {
        const { listener } = mapListeners.click[i];
        const passToNextListener = listener(event, mapRef.current);
        if (!passToNextListener) break;
      }
    };
    const mousemoveHandlers = (event: mapLibre.MapMouseEvent & mapLibre.EventData) => {
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
      accessToken={accessToken}
      ref={mapRef}
      onLoad={initLayersOrderManager}
      layersOnTop={LAYERS_ON_TOP}
      className={className}
      style={mapBaseStyle}
    />
  );
}
