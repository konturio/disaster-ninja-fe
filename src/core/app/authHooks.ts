import { appConfig } from '~core/app_config';
import { currentUserAtom, eventFeedsAtom, featureFlagsAtom } from '~core/shared_state';
import { yandexMetrics } from '~core/metrics';
import type { CurrentUser } from './user';
import type { ApiClient } from '~core/api_client';
import type {
  AppFeatureType,
  BackendFeature,
  BackendFeed,
  UserFeed,
} from '~core/auth/types';

export async function onPublicLogin(apiClient: ApiClient) {
  // load user features
  const featuresResponse = await apiClient.get<BackendFeature[]>(
    `/features`,
    { appId: appConfig.id },
    false,
  );
  setFeatures(featuresResponse);
}

function setFeatures(value) {
  // FIXME: investigate proper app and user feature merge
  const newFeatures = {};
  value?.forEach((ft) => {
    newFeatures[ft.name] = true;
  });
  featureFlagsAtom.set.dispatch(newFeatures);
}

export async function onLogin(apiClient: ApiClient, response) {
  const jwtUserdata = {
    username: response.jwtData.preferred_username,
    token: response.token,
    email: response.jwtData.email,
    firstName: response.jwtData.given_name,
    lastName: response.jwtData.family_name,
    id: response.jwtData.sub,
  };

  extLoginTasks(jwtUserdata);

  // load profile
  const profileResponse = apiClient.get<CurrentUser>(
    '/users/current_user',
    undefined,
    true,
  );

  // load user features
  const featuresResponse = apiClient.get<BackendFeature[]>(
    `/features`,
    { appId: appConfig.id },
    true,
  );

  // load user feeds
  const feedsResponse = apiClient.get<BackendFeed[]>(
    '/events/user_feeds',
    undefined,
    true,
  );

  const [profileSettled, featuresSettled, feedsSettled] = await Promise.allSettled([
    profileResponse,
    featuresResponse,
    feedsResponse,
  ]);
  if (profileSettled.status === 'fulfilled' && profileSettled.value) {
    const mergedUserdata = {
      ...profileSettled.value,
      id: jwtUserdata.id,
      token: jwtUserdata.token,
    };
    currentUserAtom.setUser.dispatch(mergedUserdata);
  }
  if (featuresSettled.status === 'fulfilled' && featuresSettled.value) {
    setFeatures(featuresSettled.value);
  }
  if (feedsSettled.status === 'fulfilled' && feedsSettled.value) {
    eventFeedsAtom.set.dispatch(feedsSettled.value);
  }
}

function extLoginTasks(user) {
  // now when intercom is a feature it can be saved in window after this check happens
  if (window['Intercom']) {
    window['Intercom']('update', {
      name: user.username,
      email: user.email,
    });
  }
  // in case we do have intercom - lets store right credentials for when it will be ready
  appConfig.intercom.name = user.username;
  appConfig.intercom['email'] = user.email;
  yandexMetrics.mark('setUserID', user.email);
}

export function onLogout() {
  eventFeedsAtom.set.dispatch();
  featureFlagsAtom.set.dispatch();
  currentUserAtom.setUser.dispatch();
  extLogoutTasks();
}

function extLogoutTasks() {
  if (window['Intercom']) {
    appConfig.intercom.name = window.konturAppConfig.INTERCOM_DEFAULT_NAME;
    appConfig.intercom['email'] = null;
    window['Intercom']('update', {
      name: appConfig.intercom.name,
      email: appConfig.intercom['email'],
    });
  }
}
