import { useCallback, useEffect, useMemo, useRef } from 'react';
import Map, { MapBoxMapProps } from '@k2-packages/map';
import MapDrawTools from '@k2-packages/map-draw-tools';
import DeckGl from '@k2-packages/deck-gl';
import { MapStyle } from '~appModule/types';
import { useDisableDoubleClick } from './useDisableDoubleClick';
import { useAtom } from '@reatom/react';
import {
  currentMapPositionAtom,
  focusedGeometryAtom,
} from '~core/shared_state';
import { useDrawings } from './useDrawings';
import { activeDrawModeAtom } from '~features/draw_tools/atoms/activeDrawMode';
import {
  DRAW_MODE_CONFIG,
  boundaryLayers,
} from '~features/draw_tools/constants';
import { useMapPositionSmoothSync } from './useMapPositionSmoothSync';

const updatedMapStyle = (
  mapStyle: MapStyle | undefined,
  layers = [],
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

export function ConnectedMap({
  mapStyle,
  markers,
  // sources,
  // dCheckBoundaries,
  ...rest
}: MapBoxMapProps) {
  const mapRef = useRef<any>();
  useMapPositionSmoothSync(mapRef);

  const [focusedGeometry, focusedGeometryAtomActions] =
    useAtom(focusedGeometryAtom);

  const [activeDrawMode, drawModeActions] = useAtom(activeDrawModeAtom);

  useDisableDoubleClick(mapRef);
  const [drawings, setDrawings, onEdit] = useDrawings();

  const onTriggerModeDataChange = useCallback(
    (data) => {
      // User finished draw some geometry
      if (data && ((data.features && data.features.length) || data.geometry)) {
        focusedGeometryAtomActions.setFocusedGeometry(data);
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
