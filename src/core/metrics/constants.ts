import forEach from 'lodash/forEach';
import castArray from 'lodash/castArray';
import { AppFeature } from '~core/auth/types';
import type { AppFeatureType } from '~core/auth/types';
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
// WIP implementation
// list format {eventToWatch: null, ...}
export function buildWatchList(hasFeature: (f: AppFeatureType) => boolean) {
  const o = {};

  const checkAvailability = (f: AppFeatureType | AppFeatureType[]) =>
    castArray(f).reduce((prev, cur) => prev && hasFeature(cur), true);

  const APPEVENT_TO_FEATURE = {
    // _done_userResourceAtom: null, // should be done before init
    [AppFeature.CURRENT_EVENT]: AppFeature.CURRENT_EVENT, // can be error
    _done_layersGlobalResource: AppFeature.LAYERS_IN_AREA, // list of layers
    [AppFeature.ANALYTICS_PANEL]: [AppFeature.ANALYTICS_PANEL, AppFeature.CURRENT_EVENT], // not in EPIG, depends on CURRENT_EVENT
    // _done_areaLayersDetailsResourceAtom: null, // can be disabled in url
    _done_layersInAreaAndEventLayerResource: [
      AppFeature.LAYERS_IN_AREA,
      AppFeature.CURRENT_EVENT,
    ], // depends on CURRENT_EVENT
    [AppFeature.EVENTS_LIST]: AppFeature.EVENTS_LIST,
  };

  forEach(APPEVENT_TO_FEATURE, (value, key, collection) => {
    const enable = value === null || checkAvailability(value);
    if (enable) {
      o[key] = null;
    }
  });

  return o;
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
