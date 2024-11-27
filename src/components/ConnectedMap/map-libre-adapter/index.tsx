import React, { useEffect, useRef, useState, forwardRef } from 'react';
import mapLibre from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { configRepo } from '~core/config';
import { EVENT_MAP_IDLE } from '~core/metrics/constants';
import { dispatchMetricsEvent } from '~core/metrics/dispatch';
import {
  mapPositionAtom,
  setCurrentMapPosition,
} from '~core/shared_state/currentMapPosition';
import { store } from '~core/store/store';
import { useArrayDiff } from './useArrayDiff';
import type {
  MapOptions,
  Map,
  LayerSpecification,
  GeoJSONSource,
  GeoJSONSourceOptions,
  StyleSpecification,
} from 'maplibre-gl';

export interface MapBoxMapProps {
  style: string;
  mapStyle?: StyleSpecification;
  className?: string;
  options?: Partial<MapOptions>;
  onLoad?: (loaded: boolean) => void;

  isochroneStyle?: any;
  layersOnTop?: string[];
}

function isGeoJsonSource(src): src is GeoJSONSource {
  return src.type === 'geojson';
}

function isGeoJsonSourceOptions(src): src is GeoJSONSourceOptions {
  return src.type === 'geojson';
}

/* Using for reset source data */
const EMPTY_FEATURE_COLLECTION = {
  type: 'FeatureCollection' as const,
  features: [],
};

function MapboxMap(
  {
    style: externalStyleLink, // initial style
    mapStyle = {
      version: 8,
      layers: [],
      sources: {},
    },
    options,
    className,
    onLoad,
    isochroneStyle,
    layersOnTop,
  }: MapBoxMapProps,
  ref,
): React.ReactElement {
  const [map, setMap] = useState<Map | null>(null);
  const mapEl = useRef<HTMLDivElement | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  /* On map instance */
  useEffect(() => {
    const { current } = mapEl;
    if (current === null) return;
    if (ref?.current) return;

    const currentMapPosition = store.v3ctx.get(mapPositionAtom);

    let mapLocation = {};

    if (currentMapPosition) {
      mapLocation =
        'bbox' in currentMapPosition
          ? { bounds: currentMapPosition.bbox }
          : {
              center: [currentMapPosition?.lng || 60, currentMapPosition?.lat || 0] as [
                number,
                number,
              ],
              zoom: currentMapPosition?.zoom || 18,
            };
    }

    const mapInstance = new mapLibre.Map({
      container: current,
      style: externalStyleLink,
      attributionControl: false,
      ...mapLocation,
      ...options,
    });

    if (mapLibre.getRTLTextPluginStatus() === 'unavailable') {
      mapLibre.setRTLTextPlugin(
        // TODO - host it with bundle
        // 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-language/v1.0.0/mapbox-gl-language.js',
        'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.0/mapbox-gl-rtl-text.js',
        (error) => error !== null && console.error('[RTL Plugin]:', error),
      );
    }

    if (ref) {
      ref.current = mapInstance;
    }
    mapInstance.on('idle', (ev) => {
      dispatchMetricsEvent(EVENT_MAP_IDLE, true);
    });
    setMap(mapInstance);
    // use initial extent if no coords in url
    const extent = configRepo.get().extent;
    if (!currentMapPosition && extent) {
      mapInstance.fitBounds(extent, { animate: false });
      const zoom = mapInstance.getZoom();
      const { lng, lat } = mapInstance.getCenter();

      setCurrentMapPosition(store.v3ctx, {
        lat,
        lng,
        zoom,
      });
    }
  }, [mapEl, externalStyleLink, options, ref]);

  /* On fit bounds effect */
  useEffect(() => {
    if (map === null) return;
    if (!mapLoaded) return;
    if (mapStyle.center !== undefined) {
      map.flyTo({
        center: mapStyle.center as [number, number],
        zoom: mapStyle.zoom || 9,
      });
      return;
    }
    if (mapStyle.zoom) {
      map.setZoom(mapStyle.zoom);
      return;
    }
  }, [map, mapLoaded, mapStyle.center, mapStyle.zoom]);

  /* On load effect */
  useEffect(() => {
    if (!map) return;
    const loadHandler = (): void => {
      // Set initial position
      setMapLoaded(true);
      onLoad && onLoad(true);
    };

    if (map.loaded()) {
      loadHandler();
    } else {
      map.on('load', loadHandler);
    }
    return () => {
      map.off('load', loadHandler);
    };
  }, [map, onLoad]);

  /* Style sources effect */
  useEffect(() => {
    if (!map) return;
    if (!mapLoaded) return;
    const { sources } = mapStyle;
    if (sources !== undefined) {
      Object.keys(sources).forEach((sourceId) => {
        const existingSource = map.getSource(sourceId);
        const newSource = sources[sourceId];
        /* If source already exist, just update data inside him if it possible, else do nothing */
        if (existingSource !== undefined) {
          if (isGeoJsonSource(existingSource)) {
            if (isGeoJsonSourceOptions(newSource)) {
              newSource.data
                ? // @ts-expect-error review unknown casting
                  existingSource.setData(newSource.data)
                : existingSource.setData(EMPTY_FEATURE_COLLECTION); // reset data if new source with same id but without data
            } else {
              console.warn('Forget wrap geojson in source?');
            }
          } else {
            // Hmmmm...
            console.warn('Not implemented YET');
          }
        } else {
          map.addSource(sourceId, sources[sourceId]);
        }
      });
    }
  }, [mapStyle.sources, mapLoaded, map, mapStyle]);

  /* Style layers effect */
  const { added: addedLayers, deleted: deletedLayers } = useArrayDiff(
    mapStyle.layers,
    !mapLoaded,
  );
  useEffect(() => {
    if (!map) return;
    if (!mapLoaded) return;
    addedLayers.forEach((layer) => {
      const previouslyAdded = map.getLayer(layer.id) !== undefined;
      if (previouslyAdded) {
        map.setLayoutProperty(layer.id, 'visibility', 'visible');
      } else {
        if (
          layersOnTop &&
          layersOnTop.length &&
          map.getLayer(layersOnTop[0]) !== undefined &&
          layersOnTop.indexOf(layer.id) === -1
        ) {
          map.addLayer(layer as LayerSpecification, layersOnTop[0]);
        } else {
          map.addLayer(layer as LayerSpecification);
        }
      }
    });
  }, [addedLayers, layersOnTop, map, mapLoaded]);

  /* Clean up */
  useEffect(() => {
    if (!map) return;
    if (!mapLoaded) return;
    deletedLayers.forEach((layer) => {
      map.setLayoutProperty(layer.id, 'visibility', 'none');
      /**
       * TODO: Remove addded and hidden layers and sources in background for save client RAM
       * When:
       * - layer not showed N seconds
       * - we have already mounted more than N layers
       * - map in idle state
       * ---
       * We also can utilize sources without connected layers too
       * */
    });
  }, [deletedLayers, map, mapLoaded]);

  /* Isochrone layer style effect */
  useEffect(() => {
    if (!map) return;
    if (!mapLoaded) return;
    const mapLayers = map.getStyle().layers || [];
    const isochroneLayer = mapLayers.filter((layer) =>
      layer.id.includes('isochrone-layer'),
    );
    if (!isochroneLayer.length) return;
    isochroneLayer.map((layer) => {
      Object.keys(isochroneStyle).forEach((key) => {
        map.setPaintProperty(layer.id, key, isochroneStyle[key]);
      });
    });
  }, [isochroneStyle, map, mapLoaded]);

  /* Deck GL cursor updates */
  useEffect(() => {
    if (!map || !mapLoaded) return;
    const deck = (map as any).__deck;
    if (!deck || !deck.props.layers || !deck.props.layers.length) return;
    /**
     * ! FIXME This cause "this.state is null" error
     * in nebula geojson editable layer, when layer not ready yet (awaiting state)
     * TASK: #6921
     * Delete try catch wrapper after this merged:
     * https://github.com/uber/nebula.gl/pull/628
     **/
    const editableLayer = deck.props.layers[0];
    deck.setProps({
      getCursor: (...args) => {
        try {
          return editableLayer.getCursor(...args);
        } catch (error) {
          console.error(error);
        }
      },
    });
  }, [map, mapLoaded]);

  return <div className={className} ref={mapEl} />;
}

export default forwardRef(MapboxMap);
