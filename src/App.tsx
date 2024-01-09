import { createRoot } from 'react-dom/client';
import { reatomContext } from '@reatom/react-v2';
import { StrictMode, Suspense } from 'react';
import { lazily } from 'react-lazily';
import { store } from '~core/store/store';
import { postAppInit } from '~core/app/postAppInit';
import type { Config } from '~core/config/types';
const { Router } = lazily(() => import('~core/router'));

const root = createRoot(document.getElementById('root')!);

const App = () => {
  return (
    <reatomContext.Provider value={store}>
      <Suspense>
        <Router />
      </Suspense>
    </reatomContext.Provider>
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
