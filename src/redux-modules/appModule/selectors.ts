import { StateWithAppModule } from './types';

export const apiConfig = (s: StateWithAppModule) => s.appModule.apiConfig;
export const mapStyle = (s: StateWithAppModule) => s.appModule.mapStyle;
export const stats = (s: StateWithAppModule) => s.appModule.stats;
export const activeDrawMode = (s: StateWithAppModule) =>
  s.appModule.activeDrawMode;
export const markers = (s: StateWithAppModule) => s.appModule.markers;
export const sources = (s: StateWithAppModule) => s.appModule.sources;
export const selectedOverlayIndex = (s: StateWithAppModule) =>
  s.appModule.selectedOverlayIndex;
export const xNumerators = (s: StateWithAppModule) => s.appModule.xNumerators;
export const yNumerators = (s: StateWithAppModule) => s.appModule.yNumerators;
export const correlationMatrix = (s: StateWithAppModule) =>
  s.appModule.correlationMatrix;
export const matrixSelection = (s: StateWithAppModule) =>
  s.appModule.matrixSelection;
export const legendCells = (s: StateWithAppModule) => s.appModule.legendCells;
export const colorThemeCurrent = (s: StateWithAppModule) =>
  s.appModule.colorThemeCurrent;
export const showLoadingIndicator = (s: StateWithAppModule) =>
  s.appModule.showLoadingIndicator;
export const uploadedGeometry = (s: StateWithAppModule) =>
  s.appModule.uploadedGeometry;
