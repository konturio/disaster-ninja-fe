import { createRoot } from 'react-dom/client';
import { reatomContext as ReatomContextV2 } from '@reatom/react-v2';
import { reatomContext as ReatomContextV3 } from '@reatom/npm-react';
import { StrictMode, Suspense } from 'react';
import { lazily } from 'react-lazily';
import { store } from '~core/store/store';
import { postAppInit } from '~core/app/postAppInit';
import { GlobalModal } from '~core/modal';
import type { Config } from '~core/config/types';
const { Router } = lazily(() => import('~core/router'));
import * as Sentry from "@sentry/react";

function initSentry(config: Config) {
  Sentry.init({
    dsn: config.sentryDsn,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ["localhost", /^https:\/\/dev-disaster-ninja\.k8s-01\.konturlabs\.com/],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
}

const root = createRoot(document.getElementById('root')!);

const App = () => {
  return (
    <ReatomContextV2.Provider value={store}>
      <ReatomContextV3.Provider value={store.v3ctx}>
        <Suspense>
          <GlobalModal />
          <Router />
        </Suspense>
      </ReatomContextV3.Provider>
    </ReatomContextV2.Provider>
  );
};

function renderApp() {
  root.render(
    import.meta.env?.VITE_DEBUG_DISABLE_REACTSTRICTMODE ? (
      <App />
    ) : (
      <StrictMode>
        <App />
      </StrictMode>
    ),
  );
}

export async function startApp(config: Config) {
  await postAppInit(config);
  initSentry(config);
  renderApp();
}
