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
  renderApp();
}
