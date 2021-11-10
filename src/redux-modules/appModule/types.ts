import { Stat } from '@k2-packages/bivariate-tools';
import { Modes } from '@k2-packages/map-draw-tools';

//------------------------------------------------------------------------------
// State
//------------------------------------------------------------------------------
export type StateWithAppModule = {
  appModule: AppModuleState;
};

export type AppModuleState = {
  apiConfig: ApiConfig;
  mapStyle: MapStyle;
  stats: null | Stat;
  selectedOverlayIndex: number;
  xNumerators: NumeratorWithDenominators[] | null;
  yNumerators: NumeratorWithDenominators[] | null;
  correlationMatrix: CorrelationMatrix | null;
  matrixSelection: MatrixSelection | null;
  colorThemeCurrent: ColorTheme | null;
  legendCells: LegendCells | null;
  selectedPolygon: string | null;
  activeDrawMode: keyof Modes;
  showLoadingIndicator: boolean;
  markers: Marker[];
  sources: Record<string, unknown>;
  uploadedGeometry: null | GeoJSON.GeoJSON;
  disastersList: Event[];
};

//------------------------------------------------------------------------------
// Correlations Matrix
//------------------------------------------------------------------------------
export type CorrelationMatrix = (number | null)[][];

//------------------------------------------------------------------------------
// Correlations Matrix
//------------------------------------------------------------------------------
export type MatrixSelection = {
  xNumerator: string | null;
  yNumerator: string | null;
};

//------------------------------------------------------------------------------
// Numerator
//------------------------------------------------------------------------------
export type NumeratorWithDenominators = {
  numeratorId: string;
  denominators: string[];
  selectedDenominator: string;
};

//------------------------------------------------------------------------------
// Denominator
//------------------------------------------------------------------------------
type DenominatorAxis = { label: string; value: string; quality?: number };

export type Denominator = {
  x: Array<DenominatorAxis>;
  y: Array<DenominatorAxis>;
};

export type DenominatorValues = {
  x: string | null;
  y: string | null;
};

export type ApiConfig = {
  TILES_API: null | string;
  GRAPHQL_API: null | string;
  BOUNDARIES_API: null | string;
};

export type ColorTheme = Array<{ id: string; color: string }>;

export type MapStyle = {
  version: number;
  layers: any[];
};

export type LegendCells = { label: string; color: string }[];

export type Marker = {
  coordinates: [number, number];
  el: JSX.Element;
  id: string;
};

type Severity =
  | 'TERMINATION'
  | 'MINOR'
  | 'MODERATE'
  | 'SEVERE'
  | 'EXTREME'
  | 'UNKNOWN';

export interface Event {
  eventId: string;
  /** Contain type and optionally name of disaster */
  eventName: string;
  /** Countries where event happen */
  locations: string;
  /** How it important */
  severity: Severity;
  /** How many people affected. >= 0 */
  affectedPopulation: number;
  /** Settled area in km2. >= 0 */
  settledArea: number;
  /** Map quality. Float. Lower is better */
  osmGaps: number | null;
  /** Time in UTC (ISO8601) */
  updatedAt: string;
}

export interface AnalyticsData {
  name: string;
  description: string;
  text: string;
  percentValue?: number;
}

export type EventWithGeometry = {
  eventId: string;
  eventName: string;
  externalUrls: string[];
  severity: Severity;
  geojson: GeoJSON.GeoJSON;
};
