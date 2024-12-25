import { AppFeature } from '~core/app/types';
import { configRepo } from '~core/config';
import type { MetricsReportTemplate } from './types';

export const METRICS_EVENT = 'METRICS';

export const EVENT_MAP_IDLE = 'setTrue_mapIdle';

export const METRICS_REPORT_TEMPLATE: MetricsReportTemplate = {
  name: '',
  value: 0,
  type: 'SUMMARY',
  appId: '',
  buildVersion: `${import.meta.env.PACKAGE_VERSION}-${import.meta.env.MODE}`,
};

const APPEVENT_TO_FEATURE = {
  'router-layout-ready': null,
  [AppFeature.CURRENT_EVENT]: [AppFeature.CURRENT_EVENT], // can be error
  layersGlobalResource: null,
  allLayers: null,
  apiClient_isIdle: null,
  // [AppFeature.EVENTS_LIST]: [AppFeature.EVENTS_LIST], // not needed for TTI
};

// ! Relevant only for map mode
// WIP implementation
// WatchList format {eventToWatch: null, ...}
export function buildWatchList() {
  const effectiveWatchList = {};

  Object.entries(APPEVENT_TO_FEATURE).forEach(([appEvent, value]) => {
    if (value === null || value.every((f) => !!configRepo.get().features[f])) {
      effectiveWatchList[appEvent] = null;
    }
  });

  return effectiveWatchList;
}
