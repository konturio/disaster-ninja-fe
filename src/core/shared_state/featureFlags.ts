import { configRepo } from '~core/config';
import { createAtom } from '~utils/atoms';
import { AppFeature } from '~core/app/types';

export const FeatureFlag = AppFeature;

export const featureFlagsAtom = createAtom(
  {},
  (_, state = { ...configRepo.get().features }) => {
    // check features override from .env and .env.local files.
    // use it to enable/disable specific features for development
    if (import.meta.env.VITE_FEATURES_CONFIG) {
      try {
        const featuresOverride = JSON.parse(
          import.meta.env.VITE_FEATURES_CONFIG as string,
        );
        if (featuresOverride) {
          state = { ...state, ...featuresOverride };
        }
      } catch (e) {
        console.error('Local features override error', e);
      }
    }

    return state;
  },
  '[Shared state] featureFlagsAtom',
);
