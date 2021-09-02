/* eslint-disable no-param-reassign */
import { createReducer } from 'redux-act';
import produce from 'immer';
import AppConfig from '@config/AppConfig';
import { createGeoJSONSource } from '@utils/geoJSON/helpers';
import type { AppModuleState } from './types';
import {
  setConfig,
  setStats,
  setColorTheme,
  setLegendCells,
  setMapStyle,
  setSelectedOverlayIndex,
  resetSelectedOverlayIndex,
  setSelectedPolygon,
  setActiveDrawMode,
  setShowLoadingIndicator,
  setCorrelationMatrix,
  setMatrixSelection,
  setNumerators,
  setSource,
  setMarker,
  removeMarker,
  setUploadedGeometry,
} from './actions';

const initialState: AppModuleState = {
  config: {
    TILES_API: null,
    GRAPHQL_API: null,
    BOUNDARIES_API: null,
  },
  mapStyle: {
    version: 8,
    layers: [] as any[],
  },
  stats: null,
  selectedOverlayIndex: -1,
  xNumerators: null,
  yNumerators: null,
  correlationMatrix: null,
  matrixSelection: null,
  legendCells: null,
  colorThemeCurrent: null,
  selectedPolygon: null,
  activeDrawMode: AppConfig.defaultPolygonSelectionMode as any,
  uploadedGeometry: null,
  showLoadingIndicator: false,
  markers: [],
  sources: {
    'hovered-boundaries': createGeoJSONSource(),
    'selected-boundaries': createGeoJSONSource(),
  },
};

const reducer = createReducer<AppModuleState>({}, initialState);

/* Config */
reducer.on(setConfig, (state, payload) =>
  produce(state, (draft) => {
    draft.config = payload;
  }),
);

/* Stats */
reducer.on(setStats, (state, payload) =>
  produce(state, (draft) => {
    draft.stats = payload;
  }),
);

/* Active Draw Mode */
reducer.on(setActiveDrawMode, (state, payload) =>
  produce(state, (draft) => {
    draft.activeDrawMode = payload;
  }),
);

reducer.on(setUploadedGeometry, (state, payload) =>
  produce(state, (draft) => {
    draft.uploadedGeometry = payload;
  }),
);

/* Boundaries */
reducer.on(setSource, (state, { id, ...data }) =>
  produce(state, (draft) => {
    draft.sources[id] = data;
  }),
);

reducer.on(setMarker, (state, payload) =>
  produce(state, (draft) => {
    draft.markers = payload ? [payload] : [];
  }),
);

reducer.on(removeMarker, (state, payload) =>
  produce(state, (draft) => {
    draft.markers = draft.markers.filter((marker) => marker.id !== payload);
  }),
);

/* Selected Polygon */
reducer.on(setSelectedPolygon, (state, payload) =>
  produce(state, (draft) => {
    draft.selectedPolygon = payload;
  }),
);

/* Overlays */
reducer.on(setSelectedOverlayIndex, (state, payload) =>
  produce(state, (draft) => {
    draft.selectedOverlayIndex = payload;
  }),
);

reducer.on(resetSelectedOverlayIndex, (state) =>
  produce(state, (draft) => {
    draft.selectedOverlayIndex = -1;
  }),
);

/* Numerators */
reducer.on(setNumerators, (state, payload) =>
  produce(state, (draft) => {
    draft.xNumerators = payload.numX;
    draft.yNumerators = payload.numY;
  }),
);

/* Correlations Matrix */
reducer.on(setCorrelationMatrix, (state, payload) =>
  produce(state, (draft) => {
    draft.correlationMatrix = payload;
  }),
);

/* Matrix Selection */
reducer.on(setMatrixSelection, (state, payload) =>
  produce(state, (draft) => {
    draft.matrixSelection = payload;
  }),
);

reducer.on(setColorTheme, (state, payload) =>
  produce(state, (draft) => {
    draft.colorThemeCurrent = payload;
  }),
);

reducer.on(setLegendCells, (state, payload) =>
  produce(state, (draft) => {
    draft.legendCells = payload;
  }),
);

reducer.on(setMapStyle, (state, payload) =>
  produce(state, (draft) => {
    draft.mapStyle = payload;
  }),
);

reducer.on(setShowLoadingIndicator, (state, payload) =>
  produce(state, (draft) => {
    draft.showLoadingIndicator = payload;
  }),
);

export default reducer;
