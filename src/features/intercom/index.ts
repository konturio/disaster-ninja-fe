import { createBooleanAtom } from '~utils/atoms';
import { configRepo } from '~core/config';
import { currentUserSubscriptionResource } from '~core/shared_state/currentSubscription';
import { store } from '~core/store/store';
import { AppFeature } from '~core/app/types';

export const intercomVisibleAtom = createBooleanAtom(false, 'intercomVisibleAtom');

export async function initIntercom() {
  connectAndConfigureIntercom();
  intercomVisibleAtom.setTrue.dispatch(); // Add empty space in footer for intercom
}

export function openIntercomChat() {
  if (globalThis.Intercom && globalThis.intercomSettings) {
    globalThis.Intercom('showMessages');
  } else {
    console.warn('Intercom is not available');
  }
}

export function updateUserData(data) {
  if (typeof globalThis.Intercom === 'function' && globalThis.intercomSettings) {
    globalThis.Intercom('update', data);
  } else {
    console.warn('Intercom is not available, cant save', data);
  }
}

function removeIntercomSessionCookie(appId?: string) {
  if (!appId) return;
  document.cookie =
    `intercom-session-${appId}=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  // happy-dom used in tests doesn't respect expires attribute, so also blank out
  // cookie value to ensure cleanup in that environment
  document.cookie = `intercom-session-${appId}=`;
}

export function shutdownIntercom() {
  // Intercom('shutdown') should remove its cookie, but we observed it sometimes
  // sticks around when the widget fails to load. Removing it here avoids
  // showing stale conversations after logout.
  const { intercomAppId } = configRepo.getIntercomSettings();
  removeIntercomSessionCookie(intercomAppId);
  if (typeof globalThis.Intercom === 'function') {
    globalThis.Intercom('shutdown');
  }
  globalThis.intercomSettings = undefined;
}

function connectAndConfigureIntercom() {
  const { email, intercomAppId, intercomSelector, name, phone } =
    configRepo.getIntercomSettings();

  // Remove any leftover session cookie from a previous user. The Intercom
  // script may not have been loaded yet, so we clear it manually here.
  removeIntercomSessionCookie(intercomAppId);

  if (!globalThis.intercomSettings) {
    globalThis.intercomSettings = {
      name: name,
      app_id: intercomAppId,
      custom_launcher_selector: intercomSelector,
    };
    if (email) globalThis.intercomSettings.email = email;
    if (phone) globalThis.intercomSettings.phone = phone;
  }

  /* eslint-disable */
  // We pre-filled your app ID in the widget URL: 'https://widget.intercom.io/widget/e59cl64z'
  (function () {
    const intercom = globalThis.Intercom;
    if (typeof intercom === 'function') {
      intercom('reattach_activator');
      intercom('update', globalThis.intercomSettings);
    } else {
      const i = function () {
        i.c(arguments);
      };
      i.q = [];
      i.c = function (args) {
        i.q.push(args);
      };
      globalThis.Intercom = i;

      const insertIntercomScript = function () {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = `https://widget.intercom.io/widget/${intercomAppId}`;
        try {
          const firstScriptElement = document.getElementsByTagName('script')[0]!;
          firstScriptElement.parentNode?.insertBefore(script, firstScriptElement);
        } catch (error) {
          console.error('could not insert script');
        }
      };
      if (globalThis.attachEvent) {
        globalThis.attachEvent('onload', insertIntercomScript);
      } else if (
        document.readyState === 'complete' ||
        document.readyState === 'interactive'
      ) {
        insertIntercomScript();
      } else {
        window.addEventListener('load', insertIntercomScript, false);
      }
    }
  })();

  if (configRepo.get().features[AppFeature.SUBSCRIPTION]) {
    sendUserPlanId();
  }
}

async function sendUserPlanId() {
  const user = configRepo.get().user;
  if (!user) return;

  try {
    const data = await currentUserSubscriptionResource(store.v3ctx);
    updateUserData({ plan_id: data?.id || '' });
  } catch {
    console.error('Cannot load current user subscription');
  }
}
