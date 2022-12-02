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

// ! Relevant only for map mode
export const METRICS_WATCH_LIST = {
  // _done_userResourceAtom: null, // should be done before init
  _done_currentEventResource: null,
  _done_layersGlobalResource: null,
  _done_analyticsResource: null,
  // _done_areaLayersDetailsResourceAtom: null, // can be disabled in url
  _done_layersInAreaAndEventLayerResource: null,
  // _done_eventListResource: null,
  [EVENT_MAP_IDLE]: null,
};
