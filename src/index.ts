import '@reatom/react/react-dom-batched-updates';
import '@konturio/default-theme/variables.css';
import '@konturio/default-theme/defaults.css';
import '@konturio/default-theme/typography.css';
import '~utils/atoms/disableDefaultStore';
import './global.css';
import { setupApplicationEnv } from './boot';

function showCriticalError(e: Error) {
  const root = document.getElementById('root');
  if (root) {
    const wrapper = document.createElement('DIV');
    wrapper.className = 'critical-error-screen';
    const message = document.createElement('SPAN');
    message.className = 'critical-error-message';
    message.innerText = 'Application initialization failed. ';
    if (e.message) {
      message.innerText += e.message;
    }
    wrapper.appendChild(message);
    root.appendChild(wrapper);
  }
}

(async function () {
  try {
    const config = await setupApplicationEnv();
    const { startApp } = await import('./App');
    startApp(config);
  } catch (e) {
    // TODO: FE error reporting
    console.error(e);
    if (e instanceof Error) {
      showCriticalError(e);
    } else {
      showCriticalError(new Error('Unknown error'));
    }
  }
})();
