/* eslint-disable react/jsx-props-no-spreading */
import { useCallback, useEffect, useRef, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import Map, { MapBoxMapProps } from '@k2-packages/map';
import MapDrawTools from '@k2-packages/map-draw-tools';
import DeckGl from '@k2-packages/deck-gl';
import AppConfig from '@config/AppConfig';
import {
  checkBoundaries,
  setActiveDrawMode,
  setSelectedPolygon,
} from '@appModule/actions';
import bbox from '@turf/bbox';
import { useTranslation } from 'react-i18next';
import {
  MapStyle,
  StateWithAppModule,
} from '../../redux-modules/appModule/types';
import * as selectors from '../../redux-modules/appModule/selectors';

const mapStateToProps = (state: StateWithAppModule) => ({
  mapStyle: selectors.mapStyle(state),
  markers: selectors.markers(state),
  sources: selectors.sources(state),
  activeDrawMode: selectors.activeDrawMode(state),
  uploadedGeometry: selectors.uploadedGeometry(state),
});

const mapDispatchToProps = (dispatch) => ({
  setPolygonSelection: (polygonSelection: string | null) =>
    dispatch(setSelectedPolygon(polygonSelection)),
  dCheckBoundaries: (coords: [number, number]) =>
    dispatch(checkBoundaries(coords)),
  resetDrawMode: () =>
    dispatch(setActiveDrawMode(AppConfig.defaultPolygonSelectionMode as any)),
  setPolygonDrawMode: () =>
    dispatch(setActiveDrawMode(AppConfig.polygonSelectionModes[0] as any)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

const boundaryLayers = [
  {
    id: 'hovered-boundaries-layer',
    type: 'line' as const,
    source: 'hovered-boundaries',
    paint: {
      'line-color': 'black',
      'line-width': 1,
      'line-opacity': 0.7,
    },
  },
  {
    id: 'selected-boundaries-layer',
    type: 'line' as const,
    source: 'selected-boundaries',
    paint: {
      'line-color': 'black',
      'line-width': 4,
      'line-opacity': 0.7,
    },
  },
];

const updatedMapStyle = (mapStyle: MapStyle | undefined, layers, sources) => {
  if (mapStyle) {
    return {
      ...mapStyle,
      layers: mapStyle.layers.concat(layers).concat(boundaryLayers),
      sources: sources || {},
    };
  }
  return mapStyle;
};

const INIT_FEATURES: GeoJSON.GeoJSON = {
  type: 'FeatureCollection',
  features: [],
};

const DRAW_MODE_CONFIG = {
  DrawPolygonMode: {
    disableSelfIntersections: true,
  },
};

const ConnectedMap = ({
  mapStyle,
  markers,
  sources,
  activeDrawMode,
  setPolygonSelection,
  dCheckBoundaries,
  resetDrawMode,
  setPolygonDrawMode,
  uploadedGeometry,
  ...rest
}: MapBoxMapProps & ConnectedProps<typeof connector>) => {
  const { t } = useTranslation();
  const mapRef = useRef<any>();
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.doubleClickZoom.disable();
      requestAnimationFrame(() => {
        mapRef.current.resize(); // Fix for webkit
      });
    }
  }, [mapRef]);

  const [drawings, setDrawings] = useState<GeoJSON.GeoJSON>(INIT_FEATURES);

  const onTriggerModeDataChange = useCallback(
    (data) => {
      if (data && ((data.features && data.features.length) || data.geometry)) {
        setDrawings(data);
        setPolygonSelection(JSON.stringify(data));
        if (mapRef.current) {
          mapRef.current.fitBounds(bbox(data));
        }
      } else {
        resetDrawMode();
      }
    },
    [resetDrawMode, setPolygonSelection],
  );

  useEffect(() => {
    if (uploadedGeometry !== null) {
      setDrawings(uploadedGeometry);
    }
  }, [uploadedGeometry, setDrawings, activeDrawMode]);

  const drawingsRef = useRef(drawings);
  useEffect(() => {
    const dr = drawingsRef.current as any;
    if ((dr.features && dr.features.length) || dr.geometry) {
      setDrawings(INIT_FEATURES);
      setPolygonSelection(null);
    }
  }, [activeDrawMode, setPolygonSelection]);

  const onEdit = useCallback(
    ({ updatedData, editType, editContext }) => {
      switch (editType) {
        case 'addTentativePosition':
          // clear previous drawings
          if (updatedData.features && updatedData.features.length > 0) {
            setDrawings(INIT_FEATURES);
          }
          break;
        case 'addFeature':
          setDrawings(updatedData);
          setPolygonSelection(JSON.stringify(updatedData));
          break;
        case 'skipSelfIntersection':
          alert(t('Self intersections are not supported'));
          break;
        case 'selectBoundary':
          if (editContext.position && editContext.position.length > 1) {
            dCheckBoundaries(editContext.position);
          }
          break;
        default:
          break;
      }
    },
    [setDrawings, t, dCheckBoundaries, setPolygonSelection],
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
              mapStyle={updatedMapStyle(mapStyle as any, layers, sources)}
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
};

export default connector(ConnectedMap);
