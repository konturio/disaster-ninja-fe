import { useState, useRef, useCallback, useEffect } from 'react';
import { useSelect } from 'react-cosmos/fixture';
import MapDrawTools from '..';
import Map from '@k2-packages/map';
import DeckGl from '@k2-packages/deck-gl';
import modes, { DrawModes } from './modes';
import mapStyle from './mapStyle';
import { addLayers, dropUndefined } from './utils';

const OnlyDrawTools = () => {
  const [drawings, setDrawings] = useState<GeoJSON.FeatureCollection>({
    type: 'FeatureCollection' as const,
    features: [],
  });

  return (
    <MapDrawTools geoJSON={drawings} onEdit={setDrawings}>
      {({ editableLayer }) => (
        <code style={{ whiteSpace: 'pre' }}>
          {JSON.stringify(editableLayer, null, 2)}
        </code>
      )}
    </MapDrawTools>
  );
};

const DRAW_MODE_CONFIG = {
  DrawPolygonMode: {
    disableSelfIntersections: true,
  },
};

const DrawToolsWithMap = () => {
  const [mode] = useSelect('Current mode', {
    options: modes as DrawModes,
  });

  const [drawings, setDrawings] = useState<GeoJSON.FeatureCollection>({
    type: 'FeatureCollection',
    features: [],
  });

  const mapRef = useRef<mapboxgl.Map>(null);

  useEffect(() => {
    const map = mapRef.current;
    if (map !== null) {
      map.doubleClickZoom.disable();
    }
  }, [mapRef]);

  const onEdit = useCallback(
    ({ updatedData, editType, editContext }) => {
      console.log('onEdit', {
        updatedData,
        editType,
        editContext,
      });
      switch (editType) {
        case 'addFeature':
          setDrawings(updatedData);
          break;
        case 'skipSelfIntersection':
          break;
        default:
          break;
      }
    },
    [setDrawings],
  );

  return (
    <>
      <style>{` .full-height { height: 100%; } `}</style>
      <MapDrawTools
        geoJSON={drawings}
        onEdit={onEdit}
        mode={mode}
        modeConfig={DRAW_MODE_CONFIG}
      >
        {({ editableLayer }) => (
          <DeckGl layers={editableLayer && [editableLayer]}>
            {({ layers }) => (
              <Map
                className="full-height"
                ref={mapRef}
                mapStyle={addLayers<typeof mapStyle>(mapStyle, layers)}
                layersOnTop={dropUndefined([
                  editableLayer?.id,
                  'hovered-boundaries-layer',
                  'selected-boundaries-layer',
                ])}
                accessToken={
                  'pk.eyJ1IjoiYWtpeWFta2EiLCJhIjoiY2p3aG4zY2Y2MDFyNjQ2bjZ1bTNldjQyOCJ9.uM8bC4cSVnYETymmoonsEg'
                }
                style={'mapbox://styles/akiyamka/ckdrodc31065m1alpg0rxyfli'}
              />
            )}
          </DeckGl>
        )}
      </MapDrawTools>
    </>
  );
};

export default {
  OnlyDrawTools,
  DrawToolsWithMap,
};
