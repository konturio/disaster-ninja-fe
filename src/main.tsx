import '@reatom/react-v2/react-dom-batched-updates';
import '~utils/atoms/disableDefaultStore';
import { persistLog } from './logger';
import { setupApplicationEnv } from './boot';
import '@konturio/default-theme/variables.css';
import '@konturio/default-theme/defaults.css';
import '@konturio/default-theme/typography.css';
import './global.css';

async function showCriticalError(e: Error) {
  const root = document.getElementById('root');
  if (root) {
    const title = 'Critical error';
    const message = e.message ?? 'With unknown reason';
    const trace = e.stack;
    if (import.meta.env.PROD) {
      persistLog(message, trace);
    }

    root.innerHTML = `
      <div class="critical-error-screen">
        <h1>${title}</h1>
        <p>${message}</p>
        ${trace ? `<code>${trace}</code>` : ''}
      </div>
    `;
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
