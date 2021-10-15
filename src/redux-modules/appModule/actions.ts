import { createAction } from 'redux-act';
import { Stat } from '@k2-packages/bivariate-tools';
import { Modes } from '@k2-packages/map-draw-tools';
import {
  ApiConfig,
  ColorTheme,
  MapStyle,
  LegendCells,
  NumeratorWithDenominators,
  CorrelationMatrix,
  Marker,
  Event,
} from './types';

/* Config */
export const requestConfig = createAction('requestConfig');
export const setConfig = createAction<ApiConfig>('setConfig');

/* Stats */
export const requestStats = createAction('requestStats');
export const setStats = createAction<Stat>('setStats');

/* Disasters List */
export const setDisastersList = createAction<Event[]>('setDisastersList');

/* Active draw mode */
export const setActiveDrawMode = createAction<keyof Modes>('setActiveDrawMode');
export const setUploadedGeometry = createAction<GeoJSON.GeoJSON>(
  'setUploadedGeometry',
);

/* Boundaries  */
export const checkBoundaries =
  createAction<[number, number]>('checkBoundaries');
export const setBoundaries =
  createAction<GeoJSON.FeatureCollection[]>('setBoundaries');
export const showBoundaries =
  createAction<GeoJSON.FeatureCollection[]>('showBoundaries');
export const setMarker = createAction<Marker | null>('setMarker');
export const removeMarker = createAction<string>('removeMarker');
export const setSource =
  createAction<{ [prop: string]: any; id: string }>('setSource');

/* Polygon selection */
export const setSelectedPolygon = createAction<string | null>(
  'setSelectedPolygon',
);

/* Overlays */
export const setSelectedOverlayIndex = createAction<number>(
  'setSelectedOverlayIndex',
);
export const resetSelectedOverlayIndex = createAction(
  'resetSelectedOverlayIndex',
);

/* Numerators */
export const setNumerators = createAction<
  NumeratorWithDenominators[],
  NumeratorWithDenominators[],
  { numX: NumeratorWithDenominators[]; numY: NumeratorWithDenominators[] }
>(
  'setNumerators',
  (numX: NumeratorWithDenominators[], numY: NumeratorWithDenominators[]) => ({
    numX,
    numY,
  }),
);

/* Correlations Matrix */
export const setCorrelationMatrix = createAction<CorrelationMatrix>(
  'setCorrelationsMatrix',
);

export const setMatrixSelection = createAction<
  string | null,
  string | null,
  {
    xNumerator: string | null;
    yNumerator: string | null;
  }
>(
  'setMatrixSelection',
  (xNumerator: string | null, yNumerator: string | null) => ({
    xNumerator,
    yNumerator,
  }),
);

/* ColorThemes */
export const setColorTheme = createAction<ColorTheme>('setColorTheme');

/* MapStyle */
export const setMapStyle = createAction<MapStyle>('setMapStyle');

/* Legend */
export const setLegendCells = createAction<LegendCells>('setLegendCells');

/* Loading Indicator */
export const setShowLoadingIndicator = createAction<boolean>(
  'setShowLoadingIndicator',
);
