import { useCallback, useEffect, useRef } from 'react';
import mapLibre from 'maplibre-gl';
import { useAction, useAtom } from '@reatom/react';
import { currentMapAtom, mapListenersAtom } from '~core/shared_state';
import { layersOrderManager } from '~core/logical_layers/utils/layersOrder/layersOrder';
import Map from './map-libre-adapter';
import DeckGl from './deck-gl';
import { useMapPositionSmoothSync } from './useMapPositionSmoothSync';
import type { MapBoxMapProps } from './map-libre-adapter';
import type { MapStyle } from '~core/types';

const updatedMapStyle = (
  mapStyle: MapStyle | undefined,
  layers = [] as unknown,
  sources = {},
) => {
  if (mapStyle) {
    return {
      ...mapStyle,
      layers: (mapStyle.layers || []).concat(layers),
      sources: sources || {},
    };
  }
  return mapStyle;
};

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

export function ConnectedMap({
  mapStyle,
  markers,
  // sources,
  // dCheckBoundaries,
  ...rest
}: MapBoxMapProps) {
  const mapRef = useRef<ApplicationMap>();
  useMapPositionSmoothSync(mapRef);

  // init current MapRefAtom
  const setCurrentMap = useAction(currentMapAtom.setMap);
  const resetCurrentMap = useAction(currentMapAtom.resetMap);

  const [mapListeners] = useAtom(mapListenersAtom);
  const initLayersOrderManager = useCallback(
    (map) => layersOrderManager.init(mapRef.current!),
    [],
  );

  useEffect(() => {
    if (mapRef.current) {
      console.info(
        'Map instance available by window.KONTUR_MAP',
        mapRef.current,
      );
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

    const handlers = (event: mapLibre.MapMouseEvent & mapLibre.EventData) => {
      for (let i = 0; i < mapListeners.click.length; i++) {
        const { listener } = mapListeners.click[i];
        const passToNextListener = listener(event, mapRef.current);
        if (!passToNextListener) break;
      }
    };
    if (mapRef.current) {
      mapRef.current.on('click', handlers);
    }
    return () => {
      mapRef.current?.off('click', handlers);
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

  return (
    <DeckGl layers={[]}>
      {({ layers }) => (
        <Map
          ref={mapRef}
          mapStyle={updatedMapStyle(mapStyle as any, layers, {})}
          markers={markers}
          onLoad={initLayersOrderManager}
          layersOnTop={[
            'editable-layer',
            'hovered-boundaries-layer',
            'selected-boundaries-layer',
          ]}
          {...rest}
        />
      )}
    </DeckGl>
  );
}
