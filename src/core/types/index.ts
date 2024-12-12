export type CorrelationMatrix = (number | null)[][];

export type AxisGroup = {
  parent: string | null;
  quotients: Array<[string, string]>;
  selectedQuotient: [string, string];
};

export type ColorTheme = Array<{
  id: string;
  color: string;
  isFallbackColor?: boolean;
}>;

export type MapStyle = {
  version: number;
  layers: any[];
};

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
  /** Optional param describes event loss estimation*/
  loss?: number;
  /** Time in UTC (ISO8601) */
  startedAt: string;
  /** Time in UTC (ISO8601) */
  updatedAt: string;
  externalUrls: string[];
  /** Additional info about event if presented*/
  description?: string;
  /** Event geometry bbox */
  bbox: [number, number, number, number];
  /** Event epsode count */
  episodeCount: number;
}

export interface EventWithGeometry extends Event {
  geojson: GeoJSON.GeoJSON;
}

export interface AnalyticsData {
  formula: string;
  value: number;
  unit: {
    id: string;
    shortName: string;
    longName: string;
  };
  prefix: string;
  xlabel: string;
  ylabel: string;
}

export interface AdvancedAnalyticsData {
  numerator: string;
  denominator: string;
  numeratorLabel: string;
  denominatorLabel: string;
  analytics: [AdvancedAnalyticsDataValues];
}

export interface AdvancedAnalyticsDataValues {
  calculation: string;
  value: number;
  quality: number;
}

export interface LLMAnalyticsData {
  data?: string;
}

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

export type { Episode } from './episode';
