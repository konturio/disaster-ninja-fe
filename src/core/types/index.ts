import { Stat } from '@k2-packages/bivariate-tools';
import { Modes } from '@k2-packages/map-draw-tools';

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

export type Severity =
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
  /** Country where event happen */
  location: string;
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
  externalUrls: string[];
}

export interface AnalyticsData {
  name: string;
  description: string;
  text: string;
  percentValue?: number;
}

export interface AdvancedAnalyticsData {
  numerator: string;
  denominator: string;
  numeratorLabel: string;
  denominatorLabel: number;
  analytics: [AdvancedAnalyticsDataValues];
}

export interface AdvancedAnalyticsDataValues {
  calculation: string;
  value: number;
  quality: number;
}

export type EventWithGeometry = {
  eventId: string;
  eventName: string;
  externalUrls: string[];
  severity: Severity;
  geojson: GeoJSON.GeoJSON;
};

export type LegendStepStyle = {
  'casing-color'?: string;
  'casing-offset'?: string;
  'casing-opacity'?: string;
  'casing-width'?: string;
  'fill-color'?: string;
  color?: string;
  width?: string;
  offset?: string;
};

export type LegendIconSize = 'normal' | 'small';
