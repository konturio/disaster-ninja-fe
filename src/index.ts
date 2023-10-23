import '@reatom/react/react-dom-batched-updates';
import '@konturio/default-theme/variables.css';
import '@konturio/default-theme/defaults.css';
import '@konturio/default-theme/typography.css';
import '~utils/atoms/disableDefaultStore';
import './global.css';
import { loadConfig } from '~core/app_config/loader';

async function showCriticalError(e: Error) {
  const root = document.getElementById('root');
  if (root) {
    const { render, html } = await import('uhtml');
    const title = 'Critical error';
    const message = e.message ?? 'With unknown reason';
    const trace = e.stack;
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

loadConfig()
  .then(() => import('./core/app/init'))
  .then(({ appInit }) => appInit())
  .then((initialState) => import('./App').then(({ startApp }) => startApp(initialState)))
  .catch((e: Error) => {
    // TODO: FE error reporting
    console.error(e);
    showCriticalError(e);
  });
