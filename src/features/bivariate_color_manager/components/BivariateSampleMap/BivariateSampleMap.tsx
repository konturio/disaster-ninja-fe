import { useCallback, useEffect, useRef } from 'react';
import cn from 'clsx';
import { useAction } from '@reatom/react-v2';
import { Button } from '@konturio/ui-kit';
import { Close24, Expand24 } from '@konturio/default-icons';
import { configRepo } from '~core/config';
import Map from '~components/ConnectedMap/map-libre-adapter';
import { useMapPositionSync } from '~components/ConnectedMap/useMapPositionSmoothSync';
import { mapLibreParentsIds } from '~core/logical_layers/utils/layersOrder/mapLibreParentsIds';
import { layersSettingsAtom } from '~core/logical_layers/atoms/layersSettings';
import {
  bivariateColorManagerSamleMap,
  bivariateSampleMapLayersOrderManager,
} from '../../atoms/bivariateColorManagerSamleMap';
import s from './BivariateSampleMap.module.css';
import type * as MapLibre from 'maplibre-gl';
import type { LayerSelectionFull } from '../LegendWithMap/LegendWithMap';

const LAYERS_ON_TOP = [
  'editable-layer',
  'hovered-boundaries-layer',
  'selected-boundaries-layer',
];

export function BivariateSampleMap({
  className,
  layersSelection,
  fullscreen,
  setFullscreen,
}: {
  className?: string;
  layersSelection: LayerSelectionFull;
  fullscreen: boolean;
  setFullscreen: (flag: boolean) => void;
}) {
  const mapBaseStyle = configRepo.get().mapBaseStyle;
  const mapRef = useRef<MapLibre.Map>();
  useMapPositionSync(mapRef);

  const generateLayerStyles = useAction(
    bivariateColorManagerSamleMap.generateLayerStyles,
  );
  const setCurrentMap = useAction(bivariateColorManagerSamleMap.setCurrentMap);

  const initLayersOrderManager = useCallback(
    (map) =>
      bivariateSampleMapLayersOrderManager.init(
        mapRef.current!,
        mapLibreParentsIds,
        layersSettingsAtom,
      ),
    [],
  );

  useEffect(() => {
    if (mapRef.current) {
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

      mapRef.current ? setCurrentMap(mapRef.current) : setCurrentMap(null);
    }
  }, [mapRef]);

  useEffect(() => {
    if (mapRef.current) {
      generateLayerStyles(layersSelection);
    }
  }, [mapRef, layersSelection, generateLayerStyles]);

  const escFunction = useCallback(
    (event) => {
      if (event.key === 'Escape' && fullscreen) {
        setFullscreen(false);
      }
    },
    [fullscreen, setFullscreen],
  );

  useEffect(() => {
    if (fullscreen === true) document.addEventListener('keydown', escFunction, false);
    else document.removeEventListener('keydown', escFunction, false);

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, [fullscreen, escFunction]);

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

  const toggleFullscreen = useCallback(
    () => setFullscreen(!fullscreen),
    [fullscreen, setFullscreen],
  );

  return (
    <div className={s.mapContainer}>
      <Map
        ref={mapRef}
        style={mapBaseStyle}
        onLoad={initLayersOrderManager}
        layersOnTop={LAYERS_ON_TOP}
        className={cn(className, fullscreen && s.fullscreen)}
      />
      <Button
        className={s.expandFullscreenButton}
        onClick={toggleFullscreen}
        iconAfter={<Expand24 />}
        variant="invert-outline"
        size="small"
      ></Button>

      {fullscreen && (
        <Button
          className={s.closeFullscreenButton}
          onClick={toggleFullscreen}
          iconAfter={<Close24 />}
          variant="invert-outline"
          size="small"
        ></Button>
      )}
    </div>
  );
}
