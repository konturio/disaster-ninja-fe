import type { AppFeatureType } from '~core/app/types';

export interface MetricsReportTemplate {
  name: string; // metric name, e.g. full-load-time, map-load-time, disasters-panel-load-time, etc.
  value: number; // time to full load in ms
  type: 'SUMMARY';
  appId: string;
  buildVersion: string;
}

export type MetricsEventDetail = { name: string; payload?: unknown };
export type MetricsEvent = CustomEvent<MetricsEventDetail>;

export interface Metric {
  init: (
    appId: string,
    route: string,
    hasFeature: (f: AppFeatureType) => boolean,
  ) => void;
  mark: (name: string, payload: any) => void;
}
