import { AppHeader } from '@konturio/ui-kit';
import { useEffect } from 'react';
import { AppFeature } from '~core/auth/types';
import type { FeatureInterface } from '~utils/metrics/lazyFeatureLoad';

/* eslint-disable react/display-name */
export const featureInterface: FeatureInterface = {
  affectsMap: false,
  id: AppFeature.HEADER,
  // @ts-ignore
  // todo improve app metrics #11232
  rootComponentWrap(reportReady, addedProps) {
    return () => {
      useEffect(() => reportReady(), []);
      return <AppHeader title={'fallback title'} {...addedProps} />;
    };
  },
};
