import { AppFeature } from '~core/auth/types';
import { forceRun } from '~utils/atoms/forceRun';
import { areaLayersControlsAtom } from './atoms/areaLayersControls';
import { areaLayersLegendsAndSources } from './atoms/areaLayersLegendsAndSources';
import type { InitFeatureInterface } from '~utils/metrics/initFeature';

/* eslint-disable react/display-name */
export const featureInterface: InitFeatureInterface = {
  affectsMap: true,
  id: AppFeature.LAYERS_IN_AREA,
  initFunction(reportReady) {
    forceRun(areaLayersControlsAtom);
    forceRun(areaLayersLegendsAndSources);
    // todo improve that logic in #11232
    reportReady();
  },
};
