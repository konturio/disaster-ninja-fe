import { appConfig } from '~core/app_config';
import { createAtom } from '~utils/atoms';
import { AppFeature } from '~core/auth/types';

export const FeatureFlag = AppFeature;

export const featureFlagsAtom = createAtom(
  { set: (state = { ...appConfig.effectiveFeatures }) => state },
  ({ onAction }, state = {}) => {
    onAction('set', (effectiveFeatures) => {
      if (effectiveFeatures) {
        state = effectiveFeatures;
      } else {
        // reset to defaults
        state = { ...appConfig.effectiveFeatures };
      }
    });

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
