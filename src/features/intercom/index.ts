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
    var w = window;
    var ic = w.Intercom;
    if (typeof ic === 'function') {
      ic('reattach_activator');
      ic('update', w.intercomSettings);
    } else {
      var d = document;
      var i = function () {
        i.c(arguments);
      };
      i.q = [];
      i.c = function (args) {
        i.q.push(args);
      };
      w.Intercom = i;
      var l = function () {
        var s = d.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = `https://widget.intercom.io/widget/${appConfig.intercom.app_id}`;
        var x = d.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s, x);
      };
      if (w.attachEvent) {
        w.attachEvent('onload', l);
      } else {
        w.addEventListener('load', l, false);
      }
    }
  })();
  /* eslint-enable */
}
