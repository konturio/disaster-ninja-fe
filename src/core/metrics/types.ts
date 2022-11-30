export interface MetricsReportTemplate {
  name: string; // metric name, e.g. full-load-time, map-load-time, disasters-panel-load-time, etc.
  value: number; // time to full load in ms
  type: 'SUMMARY';
  appId: string;
  userId: string | null; // null if user is not authenticated or user email according to BE
  buildVersion: string;
}

export type MetricsEventDetail = { name: string; payload?: unknown };
export type MetricsEvent = CustomEvent<MetricsEventDetail>;
