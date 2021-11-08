import { useCallback, useEffect, useRef } from 'react';
import Map, { MapBoxMapProps } from '@k2-packages/map';
import MapDrawTools from '@k2-packages/map-draw-tools';
import DeckGl from '@k2-packages/deck-gl';
import { MapStyle } from '~appModule/types';
import { useDisableDoubleClick } from './useDisableDoubleClick';
import { useAtom } from '@reatom/react';
import { currentMapAtom, focusedGeometryAtom } from '~core/shared_state';
import { useDrawings } from './useDrawings';
import { activeDrawModeAtom } from '~features/draw_tools/atoms/activeDrawMode';
import { DRAW_MODE_CONFIG } from '~features/draw_tools/constants';
import { useMapPositionSmoothSync } from './useMapPositionSmoothSync';
import mapLibre from 'maplibre-gl';

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
  const [, currentMapAtomActions] = useAtom(currentMapAtom);
  useEffect(() => {
    if (mapRef.current) {
      // @ts-expect-error Fix for react dev tools
      mapRef.current.toJSON = () => '[Mapbox Object]';
    }
    currentMapAtomActions.setMap(mapRef.current);
  }, [mapRef, currentMapAtomActions]);

  const [, focusedGeometryAtomActions] = useAtom(focusedGeometryAtom);

  const [activeDrawMode, drawModeActions] = useAtom(activeDrawModeAtom);

  useDisableDoubleClick(mapRef);
  const [drawings, setDrawings, onEdit] = useDrawings();

  const onTriggerModeDataChange = useCallback(
    (data) => {
      // User finished draw some geometry
      if (data && ((data.features && data.features.length) || data.geometry)) {
        focusedGeometryAtomActions.setFocusedGeometry({ type: 'custom' }, data);
        setDrawings(data);
      } else {
        drawModeActions.resetDrawMode();
      }
    },
    [setDrawings, drawModeActions, focusedGeometryAtomActions],
  );

  return (
    <MapDrawTools
      geoJSON={drawings}
      mode={activeDrawMode}
      modeConfig={DRAW_MODE_CONFIG}
      onEdit={onEdit}
      onTriggerModeDataChange={onTriggerModeDataChange}
      triggerOptions={{ addGeometry: false }}
    >
      {({ editableLayer }) => (
        <DeckGl layers={editableLayer && [editableLayer]}>
          {({ layers }) => (
            <Map
              ref={mapRef}
              mapStyle={updatedMapStyle(mapStyle as any, layers, {})}
              markers={markers}
              layersOnTop={[
                'editable-layer',
                'hovered-boundaries-layer',
                'selected-boundaries-layer',
              ]}
              {...rest}
            />
          )}
        </DeckGl>
      )}
    </MapDrawTools>
  );
}
