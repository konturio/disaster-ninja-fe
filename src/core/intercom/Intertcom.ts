import type { Application } from '~core/application';

export class Intercom {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }
  
  init() {
    const intercomConfig = this.app.config.intercom;
    // need this to reset intercom session for unregistered users on startup
    document.cookie = `intercom-session-${intercomConfig.app_id}= ; expires = Thu, 01 Jan 1970 00:00:00 GMT`;

    if (!globalThis.intercomSettings) {
      globalThis.intercomSettings = {
        name: intercomConfig.name,
        app_id: intercomConfig.app_id,
        custom_launcher_selector: intercomConfig.custom_launcher_selector,
      };
      if (globalThis.intercom['email']) {
        globalThis.intercomSettings['email'] = globalThis.intercom['email'];
      }
    }

    /* eslint-disable */
    // We pre-filled your app ID in the widget URL: 'https://widget.intercom.io/widget/e59cl64z'
    (function () {
      let intercom = globalThis.Intercom;
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
          script.src = `https://widget.intercom.io/widget/${intercomConfig.app_id}`;
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
    /* eslint-enable */
  }

  changeUser({ name, email }) {
    if (window['Intercom']) {
      window['Intercom']('update', {
        name: name, // jwtData.preferred_username
        email: email, // jwtData.email
      });
    }
  }
}
