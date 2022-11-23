import { createAsyncAtom } from '~core/store/atoms/createAsyncAtom';
import { UserStateStatus } from '~core/auth';
import { createAtom } from '~core/store/atoms';
import type { Store } from '@reatom/core';
import type { AuthenticationService } from '~core/auth';
import type { ApiClient } from '~core/api_client';
import type { AppFeatureType, BackendFeature } from '../types';
import type { Application } from '~core/application';

export const createFeaturesAtom = ({
  store,
  client,
  publicUserFeatures,
  authAtom,
  app,
}: {
  store: Store;
  client: ApiClient;
  publicUserFeatures: Set<AppFeatureType>;
  authAtom: AuthenticationService['atom'];
  app: Application;
}) => {
  const paramsAtom = createAtom(
    {
      authAtom,
    },
    ({ get }) => {
      return {
        appId: app.id,
        useAuth: get('authAtom') == UserStateStatus.AUTHORIZED,
      };
    },
    {
      store,
      id: 'paramsFeaturesAtom',
    },
  );

  const featuresResource = createAsyncAtom(
    paramsAtom,
    async ({ useAuth, appId }, abortController) => {
      // check features override from .env and .env.local files.
      // use it to enable/disable specific features for development
      if (import.meta.env.VITE_FEATURES_CONFIG) {
        console.warn('! Mock for features request enabled !');
        try {
          const featuresOverride = JSON.parse(
            import.meta.env.VITE_FEATURES_CONFIG as string,
          );
          if (featuresOverride) {
            return new Set(featuresOverride);
          }
        } catch (e) {
          console.error('Error when reading mock data', e);
          return publicUserFeatures;
        }
      }

      try {
        const featuresResponse = await client.get<BackendFeature[]>(
          `/features`,
          { appId },
          useAuth,
          { signal: abortController.signal },
        );
        if (featuresResponse === null) throw Error('Unavailable features');
        return new Set(featuresResponse.map((f) => f.name) as Array<AppFeatureType>);
      } catch (error) {
        console.error('Feature api call failed. Applying default features...');
        return publicUserFeatures;
      }
    },
    'featuresResourceAtom',
    { store },
  );

  return createAtom(
    {
      featuresResource,
    },
    ({ get }) => {
      const featuresResource = get('featuresResource');
      return (featuresResource.data ?? new Set()) as Set<AppFeatureType>;
    },
    { store, id: 'featuresAtom' },
  );
};

export type FeaturesAtom = ReturnType<typeof createFeaturesAtom>;
