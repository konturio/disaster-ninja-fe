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
  [AppFeature.CURRENT_EVENT]: [AppFeature.CURRENT_EVENT], // can be error
  _done_layersGlobalResource: [AppFeature.LAYERS_IN_AREA], // list of layers
  // [AppFeature.ANALYTICS_PANEL]: [AppFeature.ANALYTICS_PANEL, AppFeature.CURRENT_EVENT], // not in EPIG, depends on CURRENT_EVENT, not firing when panel closed
  // _done_areaLayersDetailsResourceAtom: null, // can be disabled in url
  _done_layersInAreaAndEventLayerResource: [
    AppFeature.LAYERS_IN_AREA,
    AppFeature.CURRENT_EVENT,
  ], // depends on CURRENT_EVENT
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

// to be used for rebuilding watchlist after further analysis
const runtimeDepsTree = {
  [AppFeature.CURRENT_EVENT]: [
    //false
    [],
    //true
    [AppFeature.ANALYTICS_PANEL, '_done_layersInAreaAndEventLayerResource'],
  ],
};
