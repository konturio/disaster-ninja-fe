import '@reatom/react/react-dom-batched-updates';
import '@konturio/default-theme/variables.css';
import '@konturio/default-theme/defaults.css';
import '@konturio/default-theme/typography.css';
import '~utils/atoms/disableDefaultStore';
import './global.css';
import { persistLog } from 'logger';
import { setupApplicationEnv } from './boot';

async function showCriticalError(e: Error) {
  const root = document.getElementById('root');
  if (root) {
    const { render, html } = await import('uhtml');
    const title = 'Critical error';
    const message = e.message ?? 'With unknown reason';
    const trace = e.stack;
    if (import.meta.env.PROD) {
      persistLog(message, trace);
    }
    const template = html`
      <style>
        .critical-error-screen {
          margin: auto;
          display: flex;
          flex-flow: column;
          margin-top: 18vh;
          max-width: 50em;
          padding: 1em;
        }

        .critical-error-screen code {
          border: 1px solid #c4c4c4;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: smaller;
        }
      </style>
      <div class="critical-error-screen">
        <h1>${title}</h1>
        <p>${message}</p>
        ${trace ? html`<code>${trace}</code>` : ''}
      </div>
    `;
    render(root, template);
  }
}

(async function () {
  try {
    const config = await setupApplicationEnv();
    const { startApp } = await import('./App');
    startApp(config.initialUrl);
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
