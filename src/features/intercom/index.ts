// @ts-nocheck

import appConfig from '~core/app_config';

export function initIntercom() {
  // need this to reset intercom session for unregistered users on startup
  document.cookie = `intercom-session-${appConfig.intercom.app_id}= ; expires = Thu, 01 Jan 1970 00:00:00 GMT`;

  window.intercomSettings = {
    name: appConfig.intercom.name,
    app_id: appConfig.intercom.app_id,
    custom_launcher_selector: appConfig.intercom.custom_launcher_selector,
  };

  /* eslint-disable */
  // We pre-filled your app ID in the widget URL: 'https://widget.intercom.io/widget/e59cl64z'
  (function () {
    let intercom = window.Intercom;
    if (typeof intercom === 'function') {
      intercom('reattach_activator');
      intercom('update', window.intercomSettings);
    } else {
      const i = function () {
        i.c(arguments);
      };
      i.q = [];
      i.c = function (args) {
        i.q.push(args);
      };
      window.Intercom = i;

      const insertIntercomScript = function () {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = `https://widget.intercom.io/widget/${appConfig.intercom.app_id}`;
        try {
          const firstScriptElement =
            document.getElementsByTagName('script')[0]!;
          firstScriptElement.parentNode.insertBefore(
            script,
            firstScriptElement,
          );
        } catch (error) {
          console.error('could not insert script');
        }
      };
      if (window.attachEvent) {
        window.attachEvent('onload', insertIntercomScript);
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
  /* eslint-enable */
}
